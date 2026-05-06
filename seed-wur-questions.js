const db = require('./db');

async function seedWUR() {
    console.log('Seeding QS WUR questions...');

    await db.executeMultiple(`
    INSERT OR IGNORE INTO questions (id, ranking_cycle_id, code, title, description, question_type, theme) VALUES
    (44, 2, 'AR1',  'Does your institution publish an annual report?', 'An annual report summarizes financial performance, academic achievements, and strategic goals.', 'yesno', 'Annual Report'),
    (45, 2, 'AR2',  'If Yes, please upload/provide the link to your last annual report.', 'Provide the direct URL or upload the PDF of your most recent annual report.', 'url', 'Annual Report'),
    (46, 2, 'FS1',  'Faculty Staff (Total)', 'Total number of academic faculty staff. Full Time, Part Time, HC, FTE.', 'number', 'Faculty Staff'),
    (47, 2, 'FS2',  'Faculty Staff Male', 'Number of male academic faculty staff (FT, PT, HC, FTE).', 'number', 'Faculty Staff'),
    (48, 2, 'FS3',  'Faculty Staff Female', 'Number of female academic faculty staff (FT, PT, HC, FTE).', 'number', 'Faculty Staff'),
    (49, 2, 'FS4',  'Faculty Staff Other', 'Faculty staff who identify as other gender or have not disclosed (FT, PT, HC, FTE).', 'number', 'Faculty Staff'),
    (50, 2, 'FS5',  'International Faculty Staff', 'Number of academic faculty staff of foreign nationality. Determined by citizenship.', 'number', 'Faculty Staff'),
    (51, 2, 'FS6',  'Staff with PhD', 'Number of academic faculty staff who hold a doctoral degree (PhD or equivalent).', 'number', 'Faculty Staff'),
    (52, 2, 'UG1',  'Undergraduate Students', 'Total number of undergraduate students enrolled at the institution.', 'number', 'Students - Undergraduate'),
    (53, 2, 'UG2',  'Undergraduate International Students', 'Number of undergraduate students of foreign nationality.', 'number', 'Students - Undergraduate'),
    (54, 2, 'UG3',  'Undergraduate Exchange Students - Inbound', 'Number of inbound exchange students at undergraduate level.', 'number', 'Students - Undergraduate'),
    (55, 2, 'UG4',  'Undergraduate Exchange Students - Outbound', 'Number of your undergraduate students who studied at a partner institution abroad.', 'number', 'Students - Undergraduate'),
    (56, 2, 'PG1',  'Graduate/Postgraduate Students', 'Total number of postgraduate students including taught masters, research masters and doctoral students.', 'number', 'Students - Graduate/Postgraduate'),
    (57, 2, 'PG2',  'Graduate/Postgraduate International Students', 'Number of postgraduate students of foreign nationality.', 'number', 'Students - Graduate/Postgraduate'),
    (58, 2, 'PG3',  'Graduate/Postgraduate Inbound Exchange Students', 'Inbound exchange students at postgraduate level.', 'number', 'Students - Graduate/Postgraduate'),
    (59, 2, 'PG4',  'Graduate/Postgraduate Outbound Exchange Students', 'Your postgraduate students temporarily studying at a partner institution abroad.', 'number', 'Students - Graduate/Postgraduate'),
    (60, 2, 'SO1',  'Students - Overall', 'Total number of students enrolled at all levels (undergraduate + postgraduate).', 'number', 'Students - Overall'),
    (61, 2, 'SO2',  'International Students - Overall', 'Total number of international students at all levels.', 'number', 'Students - Overall'),
    (62, 2, 'SO3',  'Students - Distance', 'Total number of students enrolled in fully distance/online programs.', 'number', 'Students - Overall'),
    (63, 2, 'SO4',  'International Students - Distance', 'International students enrolled in distance/online programs.', 'number', 'Students - Overall'),
    (64, 2, 'SO5',  'Exchange Students - Inbound', 'Total inbound exchange students at all levels.', 'number', 'Students - Overall'),
    (65, 2, 'SO6',  'Exchange Students - Outbound', 'Total outbound exchange students at all levels.', 'number', 'Students - Overall'),
    (66, 2, 'SD1',  'Students Male', 'Total number of male students at all levels.', 'number', 'Student Demographics'),
    (67, 2, 'SD2',  'Students Female', 'Total number of female students at all levels.', 'number', 'Student Demographics'),
    (68, 2, 'SD3',  'Students Other', 'Students who identify as other gender or have not disclosed.', 'number', 'Student Demographics'),
    (69, 2, 'SD4',  'Count of places of origin', 'Number of distinct countries from which international students originate.', 'number', 'Student Demographics'),
    (70, 2, 'AS1',  'Number of total undergraduate degree programs offered', 'Total count of distinct undergraduate degree programs offered.', 'number', 'Additional Statistics'),
    (71, 2, 'AS2',  'Number of total postgraduate degree programs offered', 'Total count of distinct postgraduate degree programs offered.', 'number', 'Additional Statistics'),
    (72, 2, 'AS3',  'Number of total undergraduate degree programs offered online', 'Count of undergraduate degree programs fully available via online/distance learning.', 'number', 'Additional Statistics'),
    (73, 2, 'AS4',  'Student Continuation Rate (in %)', 'Percentage of students who continue their studies from one year to the next.', 'number', 'Additional Statistics'),
    (74, 2, 'AS5',  'Number of total postgraduate degree programs offered online', 'Count of postgraduate programs fully available via online/distance learning.', 'number', 'Additional Statistics'),
    (75, 2, 'AS6',  'Student Retention Rate (in %)', 'Percentage of new students who remain enrolled after the first year of study.', 'number', 'Additional Statistics'),
    (76, 2, 'AS7',  'Completion Rate (in %)', 'Percentage of students who successfully complete their degree within the expected timeframe.', 'number', 'Additional Statistics'),
    (77, 2, 'AS8',  'First Generation Learners', 'Number of students who are the first in their family to attend university.', 'number', 'Additional Statistics'),
    (78, 2, 'AS9',  'Total number of non-degree courses offered online', 'Micro credentials / vocational courses that allow transfer of credits to degrees.', 'number', 'Additional Statistics'),
    (79, 2, 'TF1',  'Undergraduate Fees - Domestic', 'Average annual tuition fee charged to domestic undergraduate students.', 'number', 'Average Tuition Fees'),
    (80, 2, 'TF2',  'Undergraduate Fees - International', 'Average annual tuition fee charged to international undergraduate students.', 'number', 'Average Tuition Fees'),
    (81, 2, 'TF3',  'Graduate/postgraduate Fees - Domestic', 'Average annual tuition fee charged to domestic postgraduate students.', 'number', 'Average Tuition Fees'),
    (82, 2, 'TF4',  'Graduate/postgraduate Fees - International', 'Average annual tuition fee charged to international postgraduate students.', 'number', 'Average Tuition Fees'),
    (83, 2, 'TF5',  'Overall Student Fees - Domestic', 'Blended average of all tuition fees for domestic students across all levels.', 'number', 'Average Tuition Fees'),
    (84, 2, 'TF6',  'Overall Student Fees - International', 'Blended average of all tuition fees for international students across all levels.', 'number', 'Average Tuition Fees'),
    (85, 2, 'TF7',  'How many students receive a scholarship covering 100% of their fees?', 'Number of students with full scholarship coverage.', 'number', 'Average Tuition Fees'),
    (86, 2, 'TF8',  'How many students receive a scholarship covering at least 50% of fees?', 'Number of students with at least 50% scholarship coverage.', 'number', 'Average Tuition Fees'),
    (87, 2, 'ES1',  'Number of Students (Employment)', 'Total number of graduates used as the pool for employment statistics.', 'number', 'Employment Statistics'),
    (88, 2, 'ES2',  'Median Grad Salary (USD)', 'Median annual salary of graduates 1-15 months after graduation, reported in USD.', 'number', 'Employment Statistics'),
    (89, 2, 'EE1',  'When was the survey shared with students?', 'Timeframe after graduation when the employment survey was distributed.', 'text', 'Employment Statistics Evidence'),
    (90, 2, 'EE2',  'Which year was the survey conducted?', 'The calendar year in which the employment survey was conducted.', 'text', 'Employment Statistics Evidence'),
    (91, 2, 'EE3',  'Link or screenshot of report evidencing these numbers', 'Upload or provide the URL to the employment survey report.', 'url', 'Employment Statistics Evidence');
  `);

    console.log('QS WUR questions seeded! Total: 48 questions');
    process.exit(0);
}

seedWUR().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});