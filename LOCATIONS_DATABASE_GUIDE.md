# Locations Database Migration Guide

Монгол улсын захиргааны нэгжүүдийн мэдээллийг PostgreSQL database-д шилжүүлэх заавар.

## Файлууд

- `locations_postgresql.sql` - Database schema (tables, indexes, functions)
- `locations_to_sql.js` - JSON → SQL converter script
- `src/lib/locations.json` - Эх өгөгдөл

## Алхам 1: Schema үүсгэх

```bash
# PostgreSQL database-д холбогдох
psql -U your_username -d your_database

# Schema үүсгэх
\i locations_postgresql.sql
```

Эсвэл:

```bash
psql -U your_username -d your_database -f locations_postgresql.sql
```

## Алхам 2: Өгөгдөл оруулах

### Option A: Script ашиглах (Node.js)

```bash
# INSERT statements үүсгэх
node locations_to_sql.js > locations_data.sql

# Database-д оруулах
psql -U your_username -d your_database -f locations_data.sql
```

### Option B: Шууд оруулах

```bash
node locations_to_sql.js | psql -U your_username -d your_database
```

## Database Schema

### Tables

1. **aimag_city** - Аймаг/хот
   - `id` (SERIAL PRIMARY KEY)
   - `code` (VARCHAR(10) UNIQUE)
   - `name` (VARCHAR(255))

2. **soum_district** - Сум/дүүрэг
   - `id` (SERIAL PRIMARY KEY)
   - `code` (VARCHAR(10))
   - `name` (VARCHAR(255))
   - `aimag_city_code` (VARCHAR(10) FK)

3. **baghoroo** - Баг/хороо
   - `id` (SERIAL PRIMARY KEY)
   - `code` (VARCHAR(10))
   - `name` (VARCHAR(255))
   - `aimag_city_code` (VARCHAR(10) FK)
   - `soum_district_code` (VARCHAR(10) FK)

## Sample Queries

### 1. Аймаг/хот жагсаалт

```sql
SELECT * FROM aimag_city ORDER BY name;
```

### 2. Улаанбаатар хотын дүүргүүд

```sql
SELECT * FROM soum_district 
WHERE aimag_city_code = '11'
ORDER BY name;
```

### 3. Баянзүрх дүүргийн хороонууд

```sql
SELECT * FROM baghoroo 
WHERE aimag_city_code = '11' 
  AND soum_district_code = '10'
ORDER BY name;
```

### 4. Бүтэн хаяг авах

```sql
SELECT get_full_address('59', '01', '11');
-- Result: Улаанбаатар хот → Багануур → 5-р хороо
```

### 5. Статистик

```sql
SELECT 
    ac.name as aimag,
    COUNT(DISTINCT sd.id) as district_count,
    COUNT(b.id) as baghoroo_count
FROM aimag_city ac
LEFT JOIN soum_district sd ON ac.code = sd.aimag_city_code
LEFT JOIN baghoroo b ON sd.aimag_city_code = b.aimag_city_code 
    AND sd.code = b.soum_district_code
GROUP BY ac.name
ORDER BY baghoroo_count DESC;
```

### 6. Хайлт

```sql
-- Хороо нэрээр хайх
SELECT 
    ac.name as aimag,
    sd.name as district,
    b.name as baghoroo
FROM baghoroo b
JOIN soum_district sd ON b.aimag_city_code = sd.aimag_city_code 
    AND b.soum_district_code = sd.code
JOIN aimag_city ac ON b.aimag_city_code = ac.code
WHERE b.name ILIKE '%1-р хороо%';
```

## GraphQL Integration

Backend-д GraphQL resolver нэмэх:

```javascript
// TypeDefs
type AimagCity {
  id: ID!
  code: String!
  name: String!
  districts: [SoumDistrict!]!
}

type SoumDistrict {
  id: ID!
  code: String!
  name: String!
  aimagCityCode: String!
  baghoroos: [Baghoroo!]!
}

type Baghoroo {
  id: ID!
  code: String!
  name: String!
  aimagCityCode: String!
  soumDistrictCode: String!
}

type Query {
  aimags: [AimagCity!]!
  districts(aimagCode: String!): [SoumDistrict!]!
  baghoroos(aimagCode: String!, districtCode: String!): [Baghoroo!]!
}

// Resolvers
const resolvers = {
  Query: {
    aimags: async (_, __, { db }) => {
      return await db.query('SELECT * FROM aimag_city ORDER BY name');
    },
    districts: async (_, { aimagCode }, { db }) => {
      return await db.query(
        'SELECT * FROM soum_district WHERE aimag_city_code = $1 ORDER BY name',
        [aimagCode]
      );
    },
    baghoroos: async (_, { aimagCode, districtCode }, { db }) => {
      return await db.query(
        'SELECT * FROM baghoroo WHERE aimag_city_code = $1 AND soum_district_code = $2 ORDER BY name',
        [aimagCode, districtCode]
      );
    }
  }
};
```

## React Component Integration

Frontend-д ашиглах:

```typescript
import { gql, useQuery } from '@apollo/client';

const GET_AIMAGS = gql`
  query GetAimags {
    aimags {
      code
      name
    }
  }
`;

const GET_DISTRICTS = gql`
  query GetDistricts($aimagCode: String!) {
    districts(aimagCode: $aimagCode) {
      code
      name
    }
  }
`;

// Component-д ашиглах
const { data: aimagsData } = useQuery(GET_AIMAGS);
const { data: districtsData } = useQuery(GET_DISTRICTS, {
  variables: { aimagCode: selectedAimag },
  skip: !selectedAimag
});
```

## Backup & Restore

### Backup

```bash
pg_dump -U your_username -d your_database -t aimag_city -t soum_district -t baghoroo > locations_backup.sql
```

### Restore

```bash
psql -U your_username -d your_database < locations_backup.sql
```

## Performance Tips

1. Indexes аль хэдийн үүсгэгдсэн (schema-д байна)
2. Cache layer нэмэх (Redis):
   ```javascript
   const cachedAimags = await redis.get('aimags');
   if (cachedAimags) return JSON.parse(cachedAimags);
   ```

3. Materialized view үүсгэх:
   ```sql
   CREATE MATERIALIZED VIEW location_hierarchy AS
   SELECT 
     b.id,
     b.code,
     b.name as baghoroo_name,
     sd.name as district_name,
     ac.name as aimag_name,
     b.aimag_city_code,
     b.soum_district_code
   FROM baghoroo b
   JOIN soum_district sd ON b.aimag_city_code = sd.aimag_city_code 
     AND b.soum_district_code = sd.code
   JOIN aimag_city ac ON b.aimag_city_code = ac.code;
   
   -- Refresh when needed
   REFRESH MATERIALIZED VIEW location_hierarchy;
   ```

## Troubleshooting

### Алдаа: duplicate key value

```sql
-- Хуучин өгөгдлийг устгах
TRUNCATE TABLE baghoroo, soum_district, aimag_city CASCADE;

-- Дахин оруулах
\i locations_data.sql
```

### Алдаа: foreign key violation

Schema-г дахин үүсгэх:
```bash
psql -U your_username -d your_database -f locations_postgresql.sql
```

## Statistics

- **Аймаг/хот:** 22
- **Сум/дүүрэг:** ~330
- **Баг/хороо:** ~1,500+

Амжилттай ажиллаарай! 🎉
