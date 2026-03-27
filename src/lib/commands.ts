export interface CommandOutput {
  type: 'text' | 'neofetch' | 'clear' | 'link';
  content: string[];
  url?: string;
}

const ASCII_LOGO_LETTERS: string[][] = [
  // B
  [
    '██████╗',
    '██╔══██╗',
    '██████╔╝',
    '██╔══██╗',
    '██████╔╝',
    '╚═════╝',
  ],
  // H
  [
    '██╗  ██╗',
    '██║  ██║',
    '███████║',
    '██╔══██║',
    '██║  ██║',
    '╚═╝  ╚═╝',
  ],
  // A
  [
    ' █████╗',
    '██╔══██╗',
    '███████║',
    '██╔══██║',
    '██║  ██║',
    '╚═╝  ╚═╝',
  ],
  // R
  [
    '██████╗',
    '██╔══██╗',
    '██████╔╝',
    '██╔══██╗',
    '██║  ██║',
    '╚═╝  ╚═╝',
  ],
  // A
  [
    ' █████╗',
    '██╔══██╗',
    '███████║',
    '██╔══██║',
    '██║  ██║',
    '╚═╝  ╚═╝',
  ],
  // T
  [
    '████████╗',
    '╚══██╔══╝',
    '   ██║',
    '   ██║',
    '   ██║',
    '   ╚═╝',
  ],
  // H
  [
    '██╗  ██╗',
    '██║  ██║',
    '███████║',
    '██╔══██║',
    '██║  ██║',
    '╚═╝  ╚═╝',
  ],
];

export const AVAILABLE_COMMANDS = [
  'all', 'help', 'about', 'skills', 'projects', 'project',
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
  return { asciiLetters: ASCII_LOGO_LETTERS, info: NEOFETCH_INFO };
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
          '┌──────────────────────────────────────────────┐',
          '│  Available Commands                          │',
          '├──────────────────────────────────────────────┤',
          '│  all        → Show everything                │',
          '│  about      → Who am I                       │',
          '│  skills     → Technical skills               │',
          '│  projects   → List all projects              │',
          '│  project <n>→ Project details                │',
          '│  experience → Work experience                │',
          '│  certs      → Certifications                 │',
          '│  contact    → Get in touch                   │',
          '│  github     → Open GitHub profile            │',
          '│  linkedin   → Open LinkedIn profile          │',
          '│  resume     → Download resume                │',
          '│  neofetch   → Show system info               │',
          '│  clear      → Clear terminal                 │',
          '│  help       → Show this message              │',
          '└──────────────────────────────────────────────┘',
        ],
      };

    case 'all': {
      const sections = ['about', 'skills', 'projects', 'experience', 'certs', 'contact'] as const;
      const headers: Record<string, string> = {
        about: 'ABOUT', skills: 'SKILLS', projects: 'PROJECTS',
        experience: 'EXPERIENCE', certs: 'CERTIFICATIONS', contact: 'CONTACT',
      };
      const lines: string[] = [''];
      for (const s of sections) {
        lines.push(`  ══════════════════════════════════════════`);
        lines.push(`  ## ${headers[s]}`);
        lines.push(`  ══════════════════════════════════════════`);
        const result = executeCommand(s);
        lines.push(...result.content);
      }
      return { type: 'text', content: lines };
    }

    case 'about':
      return {
        type: 'text',
        content: [
          '',
          '  ╭── About Me ───────────────────────────────────────────╮',
          '  │                                                       │',
          '  │  Name:  Bharath M                                     │',
          '  │  Role:  Embedded Systems Developer                    │',
          '  │                                                       │',
          '  │  I specialize in embedded systems and Linux kernel    │',
          '  │  development, with hands-on experience building       │',
          '  │  real-world projects using ESP32, device drivers,     │',
          '  │  and hardware integration.                            │',
          '  │                                                       │',
          '  │  Passionate about low-level systems, performance      │',
          '  │  optimization, and bridging software with hardware.   │',
          '  │                                                       │',
          '  │  Currently seeking opportunities in embedded          │',
          '  │  firmware and Linux-based systems development.        │',
          '  │                                                       │',
          '  ╰───────────────────────────────────────────────────────╯',
          '',
        ],
      };

    case 'skills':
      return {
        type: 'text',
        content: [
          '',
          '  ┌── Programming ──────────────────────────────────┐',
          '  │  ● Embedded C                                │',
          '  │  ● C (Pointers, Memory Management)           │',
          '  │  ● Python (Scripting, Automation)            │',
          '  └──────────────────────────────────────────────────┘',
          '',
          '  ┌── Embedded Systems ───────────────────────────┐',
          '  │  ● ESP32 Development                        │',
          '  │  ● Peripheral Interfaces (I2C, SPI, UART)   │',
          '  │  ● Sensor Integration & Data Handling       │',
          '  │  ● GPIO, Interrupts, Timers                 │',
          '  └─────────────────────────────────────────────────┘',
          '',
          '  ┌── Operating Systems ─────────────────────────┐',
          '  │  ● Linux                                   │',
          '  │  ● Kernel Modules                          │',
          '  │  ● Character Device Drivers                │',
          '  │  ● User Space ↔ Kernel Space Interaction   │',
          '  └────────────────────────────────────────────────┘',
          '',
          '  ┌── Tools & Technologies ──────────────────────┐',
          '  │  ● Git & GitHub                            │',
          '  │  ● Arduino IDE                             │',
          '  │  ● Cadence (VLSI Tools)                    │',
          '  │  ● Debugging & Testing                     │',
          '  └────────────────────────────────────────────────┘',
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
          '  [1]  Linux Character Device Driver (Circular Queue)',
          '       → Kernel module with efficient data buffering',
          '                                          ',
          '',
          '  [2]  Smart MP3 Player',
          '       → SD card-based audio player with watchdog timer ',
          '         and deep sleep power optimization.',
          '                                          ',
          '',
          '  [3]  Mini Satellite Data Logger',
          '       → Multi-sensor data acquisition + SD logging',
          '                                          ',
          '',
          '  [4]  ESP32 Ambient LED System',
          '       → Real-time edge color extraction & LED sync',
          '                                          ',
          '',
          '  Type "project <number>" for detailed view.',
          '',
        ],
      };

    case 'project': {
      const num = parseInt(parts[1]);
      const projectDetails: Record<number, string[]> = {

        1: [
          '',
          '  ╭── Project 1 ─────────────────────────────────────────────────────╮',
          '  │                                                                  │',
          '  │  Linux Character Device Driver (Circular Queue)                  │',
          '  │                                                                  │',
          '  │  Developed a Linux loadable kernel module implementing           │',
          '  │  a character device driver with a circular buffer for            │',
          '  │  efficient data management.                                      │',
          '  │                                                                  │',
          '  │  Enabled communication between user space and kernel             │',
          '  │  space using file operations (read/write/ioctl).                 │',
          '  │                                                                  │',
          '  │  Implemented mutex-based synchronization to handle               │',
          '  │  concurrent access and avoid race conditions.                    │',
          '  │                                                                  │',
          '  │  Implemented blocking I/O using wait queues.                     │',
          '  │                                                                  │',
          '  │  Tech: C, Linux Kernel, Device Drivers                           │',
          '  │                                                                  │',
          '  │  Link: [View Repo](https://github.com/Bharath8071/linux-chardevice-circular-queue)                                                 │',
          '  ╰──────────────────────────────────────────────────────────────────╯',
          '',
           ],

        2: [
          '',
          '  ╭── Project 2 ───────────────────────────────────────────────────╮',
          '  │                                                                │',
          '  │  Smart MP3 Player                                              │',
          '  │                                                                │',
          '  │  Designed firmware using a state-based architecture            │',
          '  │  to manage user input, playback control, and system flow.      │',
          '  │                                                                │',
          '  │  Implemented SD card file handling with structured             │',
          '  │  navigation for audio data access and management.              │',
          '  │                                                                │',
          '  │  Integrated watchdog timer for fault recovery and              │',
          '  │  system stability during runtime.                              │',
          '  │                                                                │',
          '  │  Applied deep sleep and peripheral wake-up mechanisms          │',
          '  │  to optimize power consumption.                                │',
          '  │                                                                │',
          '  │  Developed a button-driven interface for real-time             │',
          '  │  control and responsive interaction.                           │',
          '  │                                                                │',
          '  │  Tech: ESP32, Embedded C, SPI/I2C, SD Card, Bluethoot          │',
          '  │                                                                │',
          // '  │  GitHub: github.com/Bharath8071/smart-mp3-player               │',
          '  ╰────────────────────────────────────────────────────────────────╯',
          '',
           ],

        3: [
          '',
          '  ╭── Project 3 ───────────────────────────────────────────────────╮',
          '  │                                                                │',
          '  │  Mini Satellite Data Logger                                    │',
          '  │                                                                │',
          '  │  Designed a multi-sensor data acquisition system using         │',
          '  │  ESP32 for continuous environmental monitoring.                │',
          '  │                                                                │',
          '  │  Implemented a structured data pipeline for acquisition,       │',
          '  │  preprocessing, and storage of sensor data.                    │',
          '  │                                                                │',
          '  │  Integrated multiple sensors (temperature, humidity,           │',
          '  │  pressure, IMU) for real-time telemetry capture.               │',
          '  │                                                                │',
          '  │  Developed hybrid logging with SD card for offline storage     │',
          '  │  and cloud transmission for remote monitoring.                 │',
          '  │                                                                │',
          '  │  Ensured reliable operation through efficient data             │',
          '  │  handling and optimized execution flow.                        │',
          '  │                                                                │',
          '  │  Tech: ESP32, Sensors, SD Card, IoT                            │',
          '  │                                                                │',
          // '  │  GitHub: github.com/Bharath8071/mini-satellite                 │',
          '  ╰────────────────────────────────────────────────────────────────╯',
          '',
           ],

           4: [
            '',
            '  ╭── Project 4 ───────────────────────────────────────────────────╮',
            '  │                                                                │',
            '  │  Ambient Backlight Engine                                      │',
            '  │                                                                │',
            '  │  Designed a real-time ambient lighting system using            │',
            '  │  computer vision and clustering for screen-synced output.      │',
            '  │                                                                │',
            '  │  Implemented grid-based frame segmentation and edge-only       │',
            '  │  processing to reduce computation and improve performance.     │',
            '  │                                                                │',
            '  │  Applied K-Means clustering to extract dominant colors         │',
            '  │  from each region for accurate visual mapping.                 │',
            '  │                                                                │',
            '  │  Optimized color processing using RGB ↔ HLS conversion         │',
            '  │  for better lighting representation on LEDs.                   │',
            '  │                                                                │',
            '  │  Designed a buffered update system with queue-based flow       │',
            '  │  and multithreading for low-latency LED control.               │',
            '  │                                                                │',
            '  │  Controlled WS2812 LED strips for synchronized ambient         │',
            '  │  lighting with minimal delay.                                  │',
            '  │                                                                │',
            '  │  Tech: Python, OpenCV, NumPy, K-Means, WS2812, Threads         │',
            '  │                                                                │',
            // '  │  GitHub: github.com/Bharath8071/ambient-backlight              │',
            '  ╰────────────────────────────────────────────────────────────────╯',
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
          '  ┌── Experience ───────────────────────────────────────────────┐',
          '  │                                                             │',
          '  │  ▸ Embedded Systems Intern                                  │',
          '  │    Radhva Motors (EV Company)                               │',
          '  │                                                             │',
          '  │    • Developed C modules for sensor interfacing             │',
          '  │      and real-time data acquisition in EV systems           │',
          '  │    • Implemented CAN communication for reliable             │',
          '  │      interaction between subsystems                         │',
          '  │    • Performed debugging and validation on real             │',
          '  │      hardware environments                                  │',
          '  │    • Understood system-level integration of motors,         │',
          '  │      battery management, and controllers                    │',
          '  │                                                             │',
          '  │    Link: [Read Article](https://www.linkedin.com/posts/bharath-mani_internshipexperience-evtechnology-electricvehicles-ugcPost-7349281700255842305-gPP3?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD9f2ToBQWwgCvbT7NIG2V_APJWEcMRfa7g)                                       │',
          '  │                                                             │',
          '  │  ▸ VLSI Design Intern                                       │',
          '  │    SNS College of Technology + IIT Palakkad (C2S)           │',
          '  │                                                             │',
          '  │    • Explored complete VLSI design flow from RTL            │',
          '  │      to physical layout (GDSII)                             │',
          '  │    • Designed RTL modules using Verilog and worked          │',
          '  │      with Cadence tools for circuit design                  │',
          '  │    • Connected academic learning with real-world            │',
          '  │      semiconductor workflows                                │',
          '  │                                                             │',
          '  │    Link: [Read Article](https://www.linkedin.com/pulse/bridging-academia-industry-my-journey-through-vlsi-design-bharath-m-cjldc)                                       │',
          '  │                                                             │',
          '  └─────────────────────────────────────────────────────────────┘',
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
          '  ╭── Contact ───────────────────────────────────────╮',
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
