const commandInput = document.getElementById('command-input');
const outputDiv = document.getElementById('output');

const filesystem = {
  '/': {
    type: 'directory',
    content: ['home'],
    parent: null
  },
  '/home': {
    type: 'directory',
    content: ['file1.txt', 'file2.txt', 'projects'],
    parent: '/'
  },
  '/home/file1.txt': {
    type: 'file',
    content: 'This is the content of file1.txt',
    parent: '/home'
  },
  '/home/file2.txt': {
    type: 'file',
    content: 'This is the content of file2.txt',
    parent: '/home'
  },
  '/home/projects': {
    type: 'directory',
    content: ['project1', 'project2'],
    parent: '/home'
  },
  '/home/projects/project1': {
    type: 'file',
    content: 'This is the content of project1',
    parent: '/home/projects'
  },
  '/home/projects/project2': {
    type: 'file',
    content: 'This is the content of project2',
    parent: '/home/projects'
  }
};

let currentDirectory = '/home';

commandInput.addEventListener('keyup', function(event) {
  if (event.keyCode === 13) {
    const command = commandInput.value.trim();
    executeCommand(command);
    commandInput.value = '';
  }
});

function executeCommand(command) {
  const output = document.createElement('p');
  output.innerText = '> ' + command;

  const commandParts = command.split(' ');
  const commandName = commandParts[0];

  switch (commandName) {
    case 'help':
      const helpText = 'Available commands:\n' +
        '- help: Display available commands.\n' +
        '- ls: List files and directories in the current directory.\n' +
        '- cd [directory]: Change to the specified directory.\n' +
        '- cat [file]: Display the content of the specified file.';
      output.innerText += '\n' + helpText;
      break;

    case 'ls':
      const currentDirectoryContent = filesystem[currentDirectory].content;
      let lsOutput = '';
      for (let i = 0; i < currentDirectoryContent.length; i++) {
        const item = currentDirectoryContent[i];
        const itemType = filesystem[getItemPath(item)].type;
        const itemColor = itemType === 'directory' ? 'cyan' : 'white';
        lsOutput += `<span class="${itemType}" style="color: ${itemColor};">${item}</span> `;
      }
      output.innerHTML += '\n' + lsOutput;
      break;

    case 'cd':
      const targetDirectory = commandParts[1];
      if (!targetDirectory) {
        output.innerText += '\nMissing target directory.';
      } else if (targetDirectory === '..') {
        const parentDirectory = filesystem[currentDirectory].parent;
        if (parentDirectory) {
          currentDirectory = parentDirectory;
        }
      } else if (targetDirectory in filesystem) {
        if (filesystem[targetDirectory].type === 'directory') {
          currentDirectory = getItemPath(targetDirectory);
        } else {
          output.innerText += '\n' + targetDirectory + ' is not a directory.';
        }
      } else {
        output.innerText += '\nDirectory not found: ' + targetDirectory;
      }
      break;

    case 'cat':
      const targetFile = commandParts[1];
      if (!targetFile) {
        output.innerText += '\nMissing target file.';
      } else if (targetFile in filesystem && filesystem[targetFile].type === 'file') {
        const fileContent = filesystem[targetFile].content;
        output.innerText += '\n' + fileContent;
      } else {
        output.innerText += '\nFile not found: ' + targetFile;
      }
      break;

    default:
      output.innerText += '\nCommand not found. Type "help" for available commands.';
      break;
  }

  outputDiv.appendChild(output);
  outputDiv.scrollTop = outputDiv.scrollHeight;
}

function getItemPath(item) {
  return currentDirectory === '/' ? `/${item}` : `${currentDirectory}/${item}`;
}