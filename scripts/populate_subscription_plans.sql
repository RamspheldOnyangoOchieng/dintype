-- Populate subscription plans with SEK pricing
INSERT INTO subscription_plans (id, name, description, duration, original_price, discounted_price, currency, active, features) VALUES
('monthly', 'Månadsabonnemang', 'Få full tillgång i en månad', 1, 199, 129, 'SEK', true, ARRAY['Obegränsade meddelanden', 'Prioriterad bildgenerering', 'Fler karaktärer', 'Inga annonser']),
('quarterly', 'Kvartalsabonnemang', 'Spara 50% med kvartalsvis betalning', 3, 597, 297, 'SEK', true, ARRAY['Obegränsade meddelanden', 'Prioriterad bildgenerering', 'Fler karaktärer', 'Inga annonser', 'Bättre värde']),
('yearly', 'Årsabonnemang', 'Bästa värdet - spara 70%', 12, 2388, 708, 'SEK', true, ARRAY['Obegränsade meddelanden', 'Prioriterad bildgenerering', 'Fler karaktärer', 'Inga annonser', 'Maximal besparing', 'Exklusivt innehåll']);
