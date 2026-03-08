export interface CommandOutput {
  type: 'text' | 'neofetch' | 'clear' | 'link';
  content: string[];
  url?: string;
}

const ASCII_LOGO = [
  '██████╗ ██╗  ██╗ █████╗ ██████╗  █████╗ ████████╗██╗  ██╗',
  '██╔══██╗██║  ██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██║  ██║',
  '██████╔╝███████║███████║██████╔╝███████║   ██║   ███████║',
  '██╔══██╗██╔══██║██╔══██║██╔══██╗██╔══██║   ██║   ██╔══██║',
  '██████╔╝██║  ██║██║  ██║██║  ██║██║  ██║   ██║   ██║  ██║',
  '╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝',
];

export const AVAILABLE_COMMANDS = [
  'help', 'about', 'skills', 'projects', 'project',
  'experience', 'certs', 'contact', 'github', 'linkedin',
  'resume', 'clear', 'neofetch',
];

const NEOFETCH_INFO = [
  { label: '', value: 'bharath@portfolio', isHeader: true },
  { label: '', value: '─────────────────', isHeader: false },
  { label: 'Role', value: 'Embedded Systems Engineer' },
  { label: 'Focus', value: 'Linux Kernel + Embedded Systems' },
  { label: 'Location', value: 'India' },
  { label: '', value: '' },
  { label: 'OS', value: 'Bharath Portfolio OS' },
  { label: 'Kernel', value: 'Embedded v1.0' },
  { label: 'Shell', value: 'portfolio-terminal' },
  { label: 'Projects', value: '4' },
  { label: 'Experience', value: 'Embedded + VLSI' },
];

export const BOOT_MESSAGES = [
  'Booting Bharath Portfolio OS...',
  'Loading kernel modules...',
  'Initializing embedded systems profile...',
  'Mounting /projects directory...',
  'Starting terminal service...',
  '',
];

export function getNeofetchData() {
  return { ascii: ASCII_LOGO, info: NEOFETCH_INFO };
}

export function executeCommand(input: string): CommandOutput {
  const trimmed = input.trim().toLowerCase();
  const parts = trimmed.split(/\s+/);
  const cmd = parts[0];

  switch (cmd) {
    case 'help':
      return {
        type: 'text',
        content: [
          '┌─────────────────────────────────────────────┐',
          '│  Available Commands                         │',
          '├─────────────────────────────────────────────┤',
          '│  about       → Who am I                    │',
          '│  skills      → Technical skills             │',
          '│  projects    → List all projects            │',
          '│  project <n> → Project details              │',
          '│  experience  → Work experience              │',
          '│  certs       → Certifications               │',
          '│  contact     → Get in touch                 │',
          '│  github      → Open GitHub profile          │',
          '│  linkedin    → Open LinkedIn profile        │',
          '│  resume      → Download resume              │',
          '│  neofetch    → Show system info             │',
          '│  clear       → Clear terminal               │',
          '│  help        → Show this message            │',
          '└─────────────────────────────────────────────┘',
        ],
      };

    case 'about':
      return {
        type: 'text',
        content: [
          '',
          '  ╭── About Me ──────────────────────────────────╮',
          '  │                                               │',
          '  │  Name:  Bharath Mani                          │',
          '  │  Role:  Embedded Systems Engineer             │',
          '  │                                               │',
          '  │  Focused on embedded systems, Linux kernel    │',
          '  │  development, and IoT hardware integration.   │',
          '  │                                               │',
          '  ╰───────────────────────────────────────────────╯',
          '',
        ],
      };

    case 'skills':
      return {
        type: 'text',
        content: [
          '',
          '  ┌── Programming ──────────┐',
          '  │  ● C                    │',
          '  │  ● Embedded C           │',
          '  │  ● Python               │',
          '  └─────────────────────────┘',
          '',
          '  ┌── Embedded Systems ─────┐',
          '  │  ● ESP32                │',
          '  │  ● Sensor Integration   │',
          '  │  ● I2C / SPI / UART     │',
          '  └─────────────────────────┘',
          '',
          '  ┌── Operating Systems ────┐',
          '  │  ● Linux                │',
          '  │  ● Kernel Modules       │',
          '  │  ● Device Drivers       │',
          '  └─────────────────────────┘',
          '',
          '  ┌── Tools ────────────────┐',
          '  │  ● Git                  │',
          '  │  ● Arduino IDE          │',
          '  │  ● Cadence              │',
          '  └─────────────────────────┘',
          '',
        ],
      };

    case 'projects':
      return {
        type: 'text',
        content: [
          '',
          '  Projects:',
          '  ─────────',
          '  [1]  Linux Character Device Circular Queue Driver',
          '  [2]  ESP32 Edge LED TV Ambient Lighting',
          '  [3]  Mini Satellite Sensor Logger',
          '  [4]  QR to VR Educational Platform',
          '',
          '  Type "project <number>" for details.',
          '',
        ],
      };

    case 'project': {
      const num = parseInt(parts[1]);
      const projectDetails: Record<number, string[]> = {
        1: [
          '',
          '  ╭── Project 1 ─────────────────────────────────────╮',
          '  │                                                   │',
          '  │  Linux Character Device Circular Queue Driver     │',
          '  │                                                   │',
          '  │  A loadable kernel module implementing a          │',
          '  │  character device with a circular queue buffer    │',
          '  │  for efficient data management in the Linux       │',
          '  │  kernel space.                                    │',
          '  │                                                   │',
          '  │  Tech: C, Linux Kernel, Device Drivers            │',
          '  │                                                   │',
          '  ╰───────────────────────────────────────────────────╯',
          '',
        ],
        2: [
          '',
          '  ╭── Project 2 ─────────────────────────────────────╮',
          '  │                                                   │',
          '  │  ESP32 Edge LED TV Ambient Lighting               │',
          '  │                                                   │',
          '  │  Real-time ambient lighting system using ESP32    │',
          '  │  to drive LED strips synced with TV content       │',
          '  │  for an immersive viewing experience.             │',
          '  │                                                   │',
          '  │  Tech: ESP32, C++, LED Protocols                  │',
          '  │                                                   │',
          '  ╰───────────────────────────────────────────────────╯',
          '',
        ],
        3: [
          '',
          '  ╭── Project 3 ─────────────────────────────────────╮',
          '  │                                                   │',
          '  │  Mini Satellite Sensor Logger                     │',
          '  │                                                   │',
          '  │  A compact data logger mimicking satellite        │',
          '  │  telemetry systems, collecting sensor data        │',
          '  │  with timestamped logging and transmission.       │',
          '  │                                                   │',
          '  │  Tech: Arduino, Sensors, SD Card                  │',
          '  │                                                   │',
          '  ╰───────────────────────────────────────────────────╯',
          '',
        ],
        4: [
          '',
          '  ╭── Project 4 ─────────────────────────────────────╮',
          '  │                                                   │',
          '  │  QR to VR Educational Platform                    │',
          '  │                                                   │',
          '  │  An educational platform bridging physical and    │',
          '  │  virtual learning through QR codes that launch    │',
          '  │  immersive VR experiences.                        │',
          '  │                                                   │',
          '  │  Tech: Web, VR, QR Integration                    │',
          '  │                                                   │',
          '  ╰───────────────────────────────────────────────────╯',
          '',
        ],
      };
      if (projectDetails[num]) {
        return { type: 'text', content: projectDetails[num] };
      }
      return { type: 'text', content: ['', '  Error: Invalid project number. Type "projects" to see available projects.', ''] };
    }

    case 'experience':
      return {
        type: 'text',
        content: [
          '',
          '  ┌── Experience ───────────────────────────────────┐',
          '  │                                                  │',
          '  │  ▸ VLSI Internship                              │',
          '  │    SNS College of Technology + IIT Palakkad      │',
          '  │                                                  │',
          '  │  ▸ Radhva Motors                                │',
          '  │    Embedded programming and CAN protocol         │',
          '  │    implementation.                               │',
          '  │                                                  │',
          '  └──────────────────────────────────────────────────┘',
          '',
        ],
      };

    case 'certs':
      return {
        type: 'text',
        content: [
          '',
          '  Certifications:',
          '  ───────────────',
          '  ✓  AWS Academy Gen AI Foundation',
          '  ✓  Edge AI – Edge Impulse',
          '  ✓  Generative AI – LinkedIn Learning',
          '  ✓  MySQL for Data Management – LinkedIn Learning',
          '  ✓  Python Programming – PrepInsta',
          '  ✓  Introduction to Soft Skills – TCS iON',
          '',
        ],
      };

    case 'contact':
      return {
        type: 'text',
        content: [
          '',
          '  ╭── Contact ──────────────────────────────────────╮',
          '  │                                                  │',
          '  │  Email:    bharathmani8071@gmail.com             │',
          '  │  GitHub:   github.com/Bharath8071                │',
          '  │  LinkedIn: linkedin.com/in/bharath-mani          │',
          '  │                                                  │',
          '  ╰──────────────────────────────────────────────────╯',
          '',
        ],
      };

    case 'github':
      window.open('https://github.com/Bharath8071', '_blank');
      return { type: 'text', content: ['', '  Opening GitHub profile...', ''] };

    case 'linkedin':
      window.open('https://www.linkedin.com/in/bharath-mani', '_blank');
      return { type: 'text', content: ['', '  Opening LinkedIn profile...', ''] };

    case 'resume':
      return { type: 'text', content: ['', '  ⚠ Resume download will be available soon.', ''] };

    case 'clear':
      return { type: 'clear', content: [] };

    case 'neofetch':
      return { type: 'neofetch', content: [] };

    case '':
      return { type: 'text', content: [] };

    default:
      return {
        type: 'text',
        content: [
          `  bash: ${cmd}: command not found`,
          '  Type "help" for available commands.',
        ],
      };
  }
}
