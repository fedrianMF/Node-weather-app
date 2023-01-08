import inquirer from 'inquirer';
import colors from 'colors';
const questions = [
    {
        type: 'list',
        name: 'option',
        message: 'What do you wish to do?',
        choices: [
            {
                value: 1,
                name: `${colors.green('1.')} Search city`
            },
            {
                value: 2,
                name: `${colors.green('2.')} History`
            },
            {
                value: 0,
                name: `${colors.green('0.')} Exit`
            }
        ]
    }
];

const inquirerMenu = async () => {
    console.clear();
    console.log(colors.green('========================'));
    console.log(colors.white('  Select option         '));
    console.log(colors.green('========================\n'));

    const { option } = await inquirer.prompt(questions);

    return option;
}

const pause = async () => {
    const pauseQuestion = [
        {
            type: 'input',
            name: 'enter',
            message: `Press ${colors.green('ENTER')} to continue\n`
        }
    ];

    console.log('\n');
    await inquirer.prompt(pauseQuestion);
}

const readInput = async (message) => {
    const readQuestion = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value) {
                if (value.length === 0) {
                    return 'Please, enter a value'
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(readQuestion);
    return desc;
}

const listPlaces = async (places = []) => {
    const choices = places.map((place, i) => {
        return {
            value: place.id,
            name: `${colors.green(i + 1)}. ${place.name}`
        }
    })

    choices.unshift({
        value: '0',
        name: colors.green('0.') + ' Cancelar'
    });

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Select place:',
            choices
        }
    ];

    const { id } = await inquirer.prompt(questions);
    return id;
}

const confirm = async (message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message,
        }

    ];
    const { ok } = await inquirer.prompt(question);
    return ok;
}

const showCheckList = async (tasks = []) => {
    const choices = tasks.map((task, i) => {
        return {
            value: task.id,
            name: `${colors.green(i + 1)}. ${task.description}`,
            checked: task.finished ? true : false
        }
    })

    const question = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecteds',
            choices
        }
    ];

    const { ids } = await inquirer.prompt(question);
    return ids;
}

export {
    inquirerMenu,
    pause,
    readInput,
    listPlaces,
    confirm,
    showCheckList
}