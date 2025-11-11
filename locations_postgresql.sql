-- ==================== LOCATIONS DATABASE SCHEMA ====================
-- PostgreSQL schema for Mongolian administrative divisions
-- Created from locations.json

-- Drop existing tables if they exist
DROP TABLE IF EXISTS baghoroo CASCADE;
DROP TABLE IF EXISTS soum_district CASCADE;
DROP TABLE IF EXISTS aimag_city CASCADE;

-- ==================== AIMAG/CITY TABLE ====================
CREATE TABLE aimag_city (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== SOUM/DISTRICT TABLE ====================
CREATE TABLE soum_district (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    aimag_city_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aimag_city_code) REFERENCES aimag_city(code) ON DELETE CASCADE,
    UNIQUE (aimag_city_code, code)
);

-- ==================== BAGHOROO/BAG TABLE ====================
CREATE TABLE baghoroo (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    aimag_city_code VARCHAR(10) NOT NULL,
    soum_district_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aimag_city_code) REFERENCES aimag_city(code) ON DELETE CASCADE,
    FOREIGN KEY (aimag_city_code, soum_district_code) REFERENCES soum_district(aimag_city_code, code) ON DELETE CASCADE,
    UNIQUE (aimag_city_code, soum_district_code, code)
);

-- ==================== INDEXES ====================
CREATE INDEX idx_soum_district_aimag ON soum_district(aimag_city_code);
CREATE INDEX idx_baghoroo_aimag ON baghoroo(aimag_city_code);
CREATE INDEX idx_baghoroo_soum ON baghoroo(aimag_city_code, soum_district_code);

-- ==================== INSERT AIMAG/CITY DATA ====================
INSERT INTO aimag_city (code, name) VALUES
('11', 'Улаанбаатар хот'),
('21', 'Архангай'),
('23', 'Баян-Өлгий'),
('22', 'Баянхонгор'),
('24', 'Булган'),
('26', 'Говь-Алтай'),
('25', 'Говьсүмбэр'),
('27', 'Дархан-Уул'),
('28', 'Дорноговь'),
('29', 'Дорнод'),
('31', 'Дундговь'),
('32', 'Завхан'),
('33', 'Өвөрхангай'),
('34', 'Өмнөговь'),
('35', 'Сүхбаатар'),
('36', 'Сэлэнгэ'),
('37', 'Төв'),
('38', 'Увс'),
('39', 'Ховд'),
('41', 'Хөвсгөл'),
('43', 'Хэнтий'),
('46', 'Орхон');

-- ==================== HELPER FUNCTIONS ====================

-- Function to get full address hierarchy
CREATE OR REPLACE FUNCTION get_full_address(
    p_baghoroo_code VARCHAR,
    p_soum_code VARCHAR,
    p_aimag_code VARCHAR
)
RETURNS TEXT AS $$
DECLARE
    v_result TEXT;
BEGIN
    SELECT 
        CONCAT(
            ac.name, ' → ',
            sd.name, ' → ',
            b.name
        )
    INTO v_result
    FROM baghoroo b
    JOIN soum_district sd ON b.aimag_city_code = sd.aimag_city_code 
        AND b.soum_district_code = sd.code
    JOIN aimag_city ac ON b.aimag_city_code = ac.code
    WHERE b.code = p_baghoroo_code
        AND b.soum_district_code = p_soum_code
        AND b.aimag_city_code = p_aimag_code;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ==================== EXAMPLE QUERIES ====================

-- Get all districts/soums in Ulaanbaatar
-- SELECT * FROM soum_district WHERE aimag_city_code = '11';

-- Get all baghoroo/khoroos in a specific district
-- SELECT * FROM baghoroo WHERE aimag_city_code = '11' AND soum_district_code = '01';

-- Get full address
-- SELECT get_full_address('59', '01', '11');

-- Count statistics
-- SELECT 
--     ac.name as aimag,
--     COUNT(DISTINCT sd.id) as district_count,
--     COUNT(b.id) as baghoroo_count
-- FROM aimag_city ac
-- LEFT JOIN soum_district sd ON ac.code = sd.aimag_city_code
-- LEFT JOIN baghoroo b ON sd.aimag_city_code = b.aimag_city_code 
--     AND sd.code = b.soum_district_code
-- GROUP BY ac.name
-- ORDER BY baghoroo_count DESC;

-- ==================== NOTES ====================
-- 1. To insert the complete data from locations.json, you'll need to run a script
--    that parses the JSON and generates INSERT statements
-- 2. The schema supports cascading deletes to maintain referential integrity
-- 3. Indexes are created for common query patterns
-- 4. The get_full_address() function provides formatted address strings
-- 5. You can add additional fields like coordinates, postal codes, etc. as needed

-- ==================== SAMPLE DATA SCRIPT ====================
-- Below is a Node.js script to generate INSERT statements from locations.json:

/*
const fs = require('fs');
const locations = JSON.parse(fs.readFileSync('./locations.json', 'utf8'));

let soumInserts = [];
let baghorooInserts = [];

Object.entries(locations).forEach(([aimagCode, aimag]) => {
  if (aimag.sumDuureg) {
    Object.entries(aimag.sumDuureg).forEach(([soumCode, soum]) => {
      soumInserts.push(
        `('${soumCode}', '${soum.label.replace(/'/g, "''")}', '${aimagCode}')`
      );
      
      if (soum.baghoroo) {
        Object.entries(soum.baghoroo).forEach(([bagCode, bag]) => {
          baghorooInserts.push(
            `('${bagCode}', '${bag.label.replace(/'/g, "''")}', '${aimagCode}', '${soumCode}')`
          );
        });
      }
    });
  }
});

console.log('INSERT INTO soum_district (code, name, aimag_city_code) VALUES');
console.log(soumInserts.join(',\n') + ';');
console.log('\n');
console.log('INSERT INTO baghoroo (code, name, aimag_city_code, soum_district_code) VALUES');
console.log(baghorooInserts.join(',\n') + ';');
*/

-- ==================== END OF SCHEMA ====================
