/**
 * locations_to_sql.js
 * 
 * Converts locations.json to PostgreSQL INSERT statements
 * Usage: node locations_to_sql.js > locations_data.sql
 */

const fs = require('fs');
const path = require('path');

// Read locations.json
const locationsPath = path.join(__dirname, 'src', 'lib', 'locations.json');
const locations = JSON.parse(fs.readFileSync(locationsPath, 'utf8'));

// Arrays to store INSERT statements
const soumInserts = [];
const baghorooInserts = [];

// Process each aimag/city
Object.entries(locations).forEach(([aimagCode, aimag]) => {
  if (aimag.sumDuureg) {
    // Process each soum/district
    Object.entries(aimag.sumDuureg).forEach(([soumCode, soum]) => {
      // Escape single quotes in names
      const soumName = soum.label.replace(/'/g, "''");
      
      soumInserts.push(
        `('${soumCode}', '${soumName}', '${aimagCode}')`
      );
      
      // Process each baghoroo/bag
      if (soum.baghoroo) {
        Object.entries(soum.baghoroo).forEach(([bagCode, bag]) => {
          const bagName = bag.label.replace(/'/g, "''");
          
          baghorooInserts.push(
            `('${bagCode}', '${bagName}', '${aimagCode}', '${soumCode}')`
          );
        });
      }
    });
  }
});

// Generate SQL output
console.log('-- ==================== AUTO-GENERATED INSERT STATEMENTS ====================');
console.log('-- Generated from locations.json');
console.log(`-- Generated at: ${new Date().toISOString()}`);
console.log(`-- Total soum/districts: ${soumInserts.length}`);
console.log(`-- Total baghoroo/bags: ${baghorooInserts.length}`);
console.log('-- ==================== ====================\n');

// Insert soum/district data
console.log('-- Insert soum/district data');
console.log('INSERT INTO soum_district (code, name, aimag_city_code) VALUES');
console.log(soumInserts.join(',\n'));
console.log('ON CONFLICT (aimag_city_code, code) DO NOTHING;');
console.log('\n');

// Insert baghoroo data
console.log('-- Insert baghoroo data');
console.log('INSERT INTO baghoroo (code, name, aimag_city_code, soum_district_code) VALUES');
console.log(baghorooInserts.join(',\n'));
console.log('ON CONFLICT (aimag_city_code, soum_district_code, code) DO NOTHING;');
console.log('\n');

// Statistics
console.log('-- ==================== STATISTICS ====================');
console.log(`-- Total aimag/cities: ${Object.keys(locations).length}`);
console.log(`-- Total soum/districts: ${soumInserts.length}`);
console.log(`-- Total baghoroo/bags: ${baghorooInserts.length}`);

// Summary by aimag
console.log('\n-- Summary by aimag:');
Object.entries(locations).forEach(([aimagCode, aimag]) => {
  const soumCount = aimag.sumDuureg ? Object.keys(aimag.sumDuureg).length : 0;
  let bagCount = 0;
  
  if (aimag.sumDuureg) {
    Object.values(aimag.sumDuureg).forEach(soum => {
      if (soum.baghoroo) {
        bagCount += Object.keys(soum.baghoroo).length;
      }
    });
  }
  
  console.log(`-- ${aimag.label}: ${soumCount} districts, ${bagCount} baghoroos`);
});

console.log('\n-- ==================== END ====================');
