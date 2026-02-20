-- Add zones column to sites table
-- This column will store zone data as JSONB

ALTER TABLE sites 
ADD COLUMN IF NOT EXISTS zones JSONB DEFAULT '[]'::jsonb;

-- Add comment
COMMENT ON COLUMN sites.zones IS 'Array of zone objects with id, name, and geoPoints';

-- Example zone structure:
-- [
--   {
--     "id": "zone-1",
--     "name": "Zone A",
--     "geoPoints": ["12.345,67.890", "12.346,67.891"]
--   }
-- ]

-- Update existing sites to have empty zones array
UPDATE sites 
SET zones = '[]'::jsonb 
WHERE zones IS NULL;

-- Verify
SELECT id, name, zones FROM sites;
