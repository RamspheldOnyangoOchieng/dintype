-- Fix Casing and missing translations
UPDATE characters SET gender = 'Kvinna' WHERE LOWER(gender) IN ('female', 'woman');
UPDATE characters SET gender = 'Man' WHERE LOWER(gender) IN ('male', 'man');
UPDATE characters SET relationship = 'Vän med förmåner' WHERE LOWER(relationship) IN ('sex-friend', 'casual', 'fwb');
UPDATE characters SET relationship = 'Älskarinna' WHERE LOWER(relationship) = 'mistress';
UPDATE characters SET relationship = 'Styvsyster' WHERE LOWER(relationship) IN ('step-sister', 'step sister');
UPDATE characters SET relationship = 'Flickvän' WHERE LOWER(relationship) = 'girlfriend';
UPDATE characters SET relationship = 'Pojkvän' WHERE LOWER(relationship) = 'boyfriend';
UPDATE characters SET relationship = 'Singel' WHERE LOWER(relationship) = 'singel' OR relationship = 'Single';

-- Occupation translations
UPDATE characters SET occupation = 'Student' WHERE LOWER(occupation) LIKE '%student%';
UPDATE characters SET occupation = 'Makeupartis' WHERE LOWER(occupation) = 'makeup artist';
UPDATE characters SET occupation = 'Advokat' WHERE LOWER(occupation) = 'lawyer.';
UPDATE characters SET occupation = 'Flygvärdinna' WHERE LOWER(occupation) = 'flight attendant.';
UPDATE characters SET occupation = 'Tennisspelare' WHERE LOWER(occupation) = 'tennis player.';
UPDATE characters SET occupation = 'Kunglig vakt' WHERE LOWER(occupation) LIKE '%royal guard%';
UPDATE characters SET occupation = 'Colombiansk skönhetsdrottning' WHERE LOWER(occupation) = 'colombian beauty queen';

-- One final check on Maya for good measure
UPDATE characters SET name = 'Maya' WHERE name = 'Tarrie';
