const db = require('./db');

const SUBJECTS = [
    'Arts and Humanities',
    'Clinical and Health',
    'Engineering and Technology',
    'Computer Science',
    'Life Sciences',
    'Physical Sciences',
    'Social Sciences',
    'Business and Economics',
    'Psychology',
    'Law',
    'Education'
];

const KPIS = [
    { code: 'KPI1',  title: 'Number of academic staff (FTE)',                                description: 'Total number of academic staff expressed as full-time equivalent (FTE).',                                        question_type: 'number' },
    { code: 'KPI2',  title: 'Number of academic staff of international/overseas origin (FTE)', description: 'Academic staff who are of international or overseas origin, expressed as FTE.',                               question_type: 'number' },
    { code: 'KPI3',  title: 'Number of academic staff that are female (FTE)',                description: 'Female academic staff expressed as full-time equivalent (FTE).',                                                  question_type: 'number' },
    { code: 'KPI4',  title: 'Number of research staff (FTE)',                               description: 'Total research staff expressed as full-time equivalent (FTE).',                                                   question_type: 'number' },
    { code: 'KPI5',  title: 'Total number of students (FTE)',                               description: 'Total enrolled students expressed as full-time equivalent (FTE).',                                                question_type: 'number' },
    { code: 'KPI6',  title: 'Number of students of international/overseas origin (FTE)',    description: 'International/overseas students expressed as FTE.',                                                               question_type: 'number' },
    { code: 'KPI7',  title: 'Number of students that are female (FTE)',                     description: 'Female students expressed as full-time equivalent (FTE).',                                                        question_type: 'number' },
    { code: 'KPI8',  title: 'Number of bachelors students',                                 description: 'Total number of students enrolled in bachelor degree programmes.',                                                question_type: 'number' },
    { code: 'KPI9',  title: 'Number of masters students',                                   description: 'Total number of students enrolled in master degree programmes.',                                                  question_type: 'number' },
    { code: 'KPI10', title: 'Number of doctorate students',                                 description: 'Total number of students enrolled in doctorate programmes.',                                                      question_type: 'number' },
    { code: 'KPI11', title: 'Number of Undergraduate Degrees awarded',                      description: 'Total undergraduate degrees awarded in the reporting year.',                                                      question_type: 'number' },
    { code: 'KPI12', title: 'Number of Doctorates awarded',                                 description: 'Total doctorate degrees awarded in the reporting year.',                                                          question_type: 'number' },
    { code: 'KPI13', title: 'Total institutional income',                                   description: 'Total institutional income in local currency for the reporting year.',                                            question_type: 'number' },
    { code: 'KPI14', title: 'Research income',                                              description: 'Total research income in local currency for the reporting year.',                                                  question_type: 'number' },
    { code: 'KPI15', title: 'Research income from industry and commerce',                   description: 'Research income specifically from industry and commerce in local currency.',                                      question_type: 'number' },
];

async function seedQuestions() {
    const CYCLE_ID = 3;

    console.log(`Seeding THE World University Rankings questions for cycle ${CYCLE_ID}...`);
    console.log(`${SUBJECTS.length} subjects × ${KPIS.length} KPIs = ${SUBJECTS.length * KPIS.length} questions`);

    let count = 0;
    for (const subject of SUBJECTS) {
        for (let i = 0; i < KPIS.length; i++) {
            const kpi = KPIS[i];
            await db.execute({
                sql: `INSERT INTO questions (ranking_cycle_id, code, title, description, question_type, theme, kpi_index)
                      VALUES (?, ?, ?, ?, ?, ?, ?)`,
                args: [CYCLE_ID, kpi.code, kpi.title, kpi.description, kpi.question_type, subject, i + 1]
            });
            count++;
        }
        console.log(`  ✓ ${subject} — 15 KPIs inserted`);
    }

    console.log(`\nDone! ${count} questions seeded across ${SUBJECTS.length} subjects.`);
    process.exit(0);
}

seedQuestions().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});