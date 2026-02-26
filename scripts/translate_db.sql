-- Translate Characters
UPDATE characters SET gender = 'Kvinna' WHERE gender = 'Female';
UPDATE characters SET gender = 'Man' WHERE gender = 'Male';
UPDATE characters SET relationship = 'Singel' WHERE relationship = 'Single';
UPDATE characters SET relationship = 'Dejtar' WHERE relationship = 'Dating';
UPDATE characters SET relationship = 'Gift' WHERE relationship = 'Married';
UPDATE characters SET relationship = 'Komplicerat' WHERE relationship = 'Complicated';
UPDATE characters SET body = 'Atletisk' WHERE body = 'Athletic';
UPDATE characters SET body = 'Kurvig' WHERE body = 'Curvy';
UPDATE characters SET body = 'Smal' WHERE body = 'Slim';
UPDATE characters SET body = 'Alldaglig' WHERE body = 'Average';
UPDATE characters SET body = 'Muscular' WHERE body = 'Muscular';
UPDATE characters SET occupation = 'Student' WHERE occupation = 'Student';
UPDATE characters SET occupation = 'Lärare' WHERE occupation = 'Teacher';
UPDATE characters SET occupation = 'Sjuksköterska' WHERE occupation = 'Nurse';
UPDATE characters SET occupation = 'Ingenjör' WHERE occupation = 'Engineer';
UPDATE characters SET ethnicity = 'Vit' WHERE ethnicity = 'White';
UPDATE characters SET ethnicity = 'Svart' WHERE ethnicity = 'Black';
UPDATE characters SET ethnicity = 'Asiat' WHERE ethnicity = 'Asian';
UPDATE characters SET ethnicity = 'Latina' WHERE ethnicity = 'Latina';
UPDATE characters SET ethnicity = 'Mellanöstern' WHERE ethnicity = 'Middle Eastern';
UPDATE characters SET language = 'Svenska';

-- Translate Maya (Tarrie)
UPDATE characters SET description = 'Med en varm, gyllene aura som lyser som en solkysst solnedgång, utstrålar Maya en vänlig strålglans som gör henne till en glädje att vara nära. Hennes mörka, korta hår ramar in en klarbrun blick som glittrar med värme, vilket kompletterar hennes vältränade men lockande kurvor och ansträngda leende. Hennes jordnära charm gör henne till den perfekta följeslagaren.' WHERE name IN ('Tarrie', 'Maya');

-- Translate Leah
UPDATE characters SET description = 'Leah står som en slående gestalt, hennes mejslade drag och genomträngande blick vittnar om hennes orubbliga beslutsamhet och orubbliga styrka, som hon använder med precisionen hos en erfaren kunglig vakt. Med en lekfull glimt i ögat och en smidig lätthet i sina rörelser förkroppsligar hon en dynamisk fusion av ledarskap och smidighet, alltid redo att kasta sig in i striden eller leda sina kamrater med ett leende.' WHERE name = 'Leah';

-- Translate FAQs
UPDATE faqs SET question = 'Vad är Dintype?', answer = 'Dintype är en plattform som driver uppslukande upplevelser med AI-sällskap. Den låter användare skapa, anpassa och interagera med AI-karaktärer som kan föra konversationer, generera bilder och ge sällskap.' WHERE question = 'What is Dintype?';
UPDATE faqs SET question = 'Är Dintype säkert?', answer = 'Ja, Dintype är legitimt och prioriterar användarsäkerhet och integritet. Alla konversationer skyddas med SSL-kryptering, och vi erbjuder valfri tvåfaktorsautentisering för att hålla ditt konto säkert. Din personliga information och dina interaktioner förblir privata.' WHERE question = 'Is Dintype legit and safe?';
UPDATE faqs SET question = 'Hur visas Dintype på mitt kontoutdrag?', answer = 'Vi värdesätter din integritet. Eventuella transaktioner visas under vårt diskreta moderbolag, EverAI, så ingenting på ditt kontoutdrag kommer att avslöja din Dintype-upplevelse.' WHERE question = 'How will Dintype appear on my bank statements?';

-- Translate Premium Page Content
UPDATE premium_page_content SET content = 'Köp Tokens' WHERE section = 'main_title';
UPDATE premium_page_content SET content = '100% anonymt. Du kan avbryta när som helst.' WHERE section = 'main_subtitle';
UPDATE premium_page_content SET content = 'Token-system' WHERE section = 'token_system_title';
UPDATE premium_page_content SET content = 'Betala per användning' WHERE section = 'pay_as_you_go_title';
UPDATE premium_page_content SET content = 'Köp tokens för att generera bilder. <span class="text-[#FF8C00] font-semibold">5 tokens per bild.</span>' WHERE section = 'purchase_intro';
UPDATE premium_page_content SET content = 'Hur tokens fungerar' WHERE section = 'how_tokens_work_title';
UPDATE premium_page_content SET content = 'Varje bildgenerering kostar 5 tokens' WHERE section = 'how_tokens_work_item_1';
UPDATE premium_page_content SET content = 'Tokens går aldrig ut' WHERE section = 'how_tokens_work_item_2';
UPDATE premium_page_content SET content = 'Köp i bulk för bättre pris' WHERE section = 'how_tokens_work_item_3';
UPDATE premium_page_content SET content = 'Välj Token-paket' WHERE section = 'select_package_title';
UPDATE premium_page_content SET content = 'Varför köpa Tokens?' WHERE section = 'why_buy_tokens_title';
UPDATE premium_page_content SET content = 'Inga återkommande betalningar' WHERE section = 'why_buy_tokens_item_1';
UPDATE premium_page_content SET content = 'Betala bara för det du behöver' WHERE section = 'why_buy_tokens_item_2';
UPDATE premium_page_content SET content = 'Högre kvalitet på bildgenerering' WHERE section = 'why_buy_tokens_item_3';
UPDATE premium_page_content SET content = 'Antivirus Secured' WHERE section = 'security_badge_1';
UPDATE premium_page_content SET content = 'Integritet på kontoutdrag' WHERE section = 'security_badge_2';
UPDATE premium_page_content SET content = 'Användarnamn' WHERE section = 'username_label';

-- Settings already updated by tidigare command but reinforcing
INSERT INTO settings (key, value) VALUES ('site_language', '"sv"') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
