export interface CommandOutput {
  type: 'text' | 'neofetch' | 'clear' | 'link';
  content: string[];
  url?: string;
  next?: string; // for chaining commands like 'clear' → 'neofetch' 
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
  //!
  ['',
   '',
   '',
   '',
   '',
   '',
  ],
  ['██╗',
   '██║',
   '██║',
   '╚═╝',
   '██╗',
   '╚═╝',
  ],
];

export const AVAILABLE_COMMANDS = [
  'all', 'help', 'about', 'skills', 'projects', 'project',
  'experience', 'clear', 'certs', 'contact', 'github', 'linkedin',
  'resume', 'neofetch',
];

/** Shown as inline ghost after `projects`; maps to `project` + number in executeCommand. */
export const PROJECT_SUGGEST_COMMANDS = [
  'project 1',
  'project 2',
  'project 3',
  'project 4',
] as const;

const NEOFETCH_INFO = [
  { label: '', value: 'bharath@portfolio', isHeader: true },
  { label: '', value: '─────────────────', isHeader: false },

  { label: 'Role', value: 'Embedded Systems Developer' },
  { label: 'Focus', value: 'Embedded Systems + Linux Kernel' },
  { label: 'Location', value: 'Coimbatore, India' },

  { label: 'Status', value: 'Open to Work 🟢' },

  { label: 'Email', value: 'bharathmani8071@gmail.com', link: 'mailto:bharathmani8071@gmail.com' },
  { label: 'GitHub', value: 'github.com/bharath8071', link: 'https://github.com/Bharath8071' },
  { label: 'Resume', value: 'View Resume', link: '/Bharath_Resume.pdf' },
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

function getBoxWidth() {
  if (typeof window === 'undefined') return 60;

  if (window.innerWidth < 400) return 36; // extra small phones
  if (window.innerWidth < 640) return 42;

  return 65;
}

function createBox(title: string, lines: string[], width: number) {

  const innerWidth = width - 6; // content area
  const totalWidth = innerWidth + 6; // full box width

  const contentWidth = width - 6;

  const titleText = `── ${title} `;
  const remaining = totalWidth - titleText.length - 2;

  const top = `  ╭${titleText}${'─'.repeat(Math.max(0, remaining+4))}╮`;

  const bottom = `  ╰${'─'.repeat(totalWidth - 2)}╯`;

  function wrapText(text: string): string[] {
    const words = text.split(' '); 
    const result: string[] = [];
    let current = '';

    for (let word of words) {

      if (word.includes('](')) {
        if (current) {
          result.push(current);
          current = '';
        }
        result.push(word);
        continue;
      }
    
      if ((current + (current ? ' ' : '') + word).length <= contentWidth) {
        current += (current ? ' ' : '') + word;
      } else {
        if (current) result.push(current);
        current = word;
      }
    }

    if (current) result.push(current);
    return result;
  }

  const formatted = lines.flatMap(line => {

  // ✅ If line contains markdown link → DO NOT WRAP
  if (line.includes('](')) {

    // 1. Get visible text (for correct padding)
    const visibleText = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  
    // 2. Calculate how many spaces needed
    const paddingLength = contentWidth - visibleText.length;
  
    // 3. Add padding to ORIGINAL string (not visibleText)
    const paddedLine = line + ' '.repeat(Math.max(0, paddingLength));
  
    return [`  │  ${paddedLine}  │`];
  }

  if (line.trim() === '') {
    return [`  │${' '.repeat(width - 2)}│`];
  }

  return wrapText(line).map(chunk => {
    const visibleLength = chunk.replace(/##/g, '').length;
    const padding = contentWidth - visibleLength;
    const padded = chunk + ' '.repeat(Math.max(0, padding));
    return `  │  ${padded}  │`;
  });
});

  return ['', top, ...formatted, bottom, ''];
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
          '│  projects   → List all projects              │',
          '│  skills     → Technical skills               │',
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

    case 'all-info': {
      const sections = ['about', 'projects','project 1','project 2','project 3','project 4', 'skills', 'experience', 'certs', 'contact'] as const;
      const headers: Record<string, string> = {
        about: 'ABOUT', projects: 'PROJECTS', skills: 'SKILLS',
        'project 1': 'PROJECT 1', 'project 2': 'PROJECT 2', 'project 3': 'PROJECT 3' ,'project 4': 'PROJECT 4',
        experience: 'EXPERIENCE', certs: 'CERTIFICATIONS', contact: 'CONTACT',
      };
      const lines: string[] = [''];
      for (const s of sections) {

        lines.push(`  `);
        lines.push(`  ##══════════════════════════════════════════##`);
        lines.push(`  ## ${headers[s]}`);
        lines.push(`  ##══════════════════════════════════════════##`);
        lines.push(`  `);
        // lines.push(`  ————————————————————————————————————————————————————————————————————————————————————————————`);
        // lines.push(`  `);
        // lines.push(`  ══════════════════════════════════════════`);
        // lines.push(`  ══════════════════════════════════════════`);
        const result = executeCommand(s);
        lines.push(...result.content);
      }
      return { type: 'text', content: lines };
    }

    case 'about': {
      const width = getBoxWidth();
      
      return {
        type: 'text',
          content: createBox('**About Me**', [
            'Name: Bharath M',
            'Role: Embedded Systems Developer',
            '',
            'I specialize in embedded programming and Linux kernel',
            'development with hands-on experience building real-world ',
            'projects using ESP32, STM32, device drivers, and',
            'hardware integration.',
            '',
            'I design clean, memory-efficient firmware for performance',
            'critical systems on real hardware, with a strong focus ',
            'on power optimization.',
            '',
            'Currently seeking opportunities in embedded firmware and',
            'Linux-based systems development in core product companies.',
          ], width),
      };
    }

    case 'skills': {
      const width = getBoxWidth();
    
      const programming = createBox('**Programming**', [
        '• Embedded C',
        '• C (Pointers, Memory Management)',
        '• Python (Scripting, Automation)',
      ], width);
    
      const embedded = createBox('**Embedded Systems**', [
        '• ESP32, STM32 Development',
        '• CAN, I2C, SPI, UART',
        '• Sensor Integration',
        '• GPIO, Interrupts, Timers',
      ], width);
    
      const os = createBox('**Operating Systems**', [
        '• Linux',
        '• Kernel Modules',
        '• Character Device Drivers',
        '• User Space ↔ Kernel Space',
      ], width);
    
      const tools = createBox('**Tools & Technologies**', [
        '• Git & GitHub',
        '• ESP IDF, STM32Cube IDE',
        '• VS Code, Cursor',
        '• Debugging & Testing',
      ], width);
    
      return {
        type: 'text',
        content: [
          ...programming,
          '',
          ...embedded,
          '',
          ...os,
          '',
          ...tools,
        ],
      };
    }

    case 'projects':
      return {
        type: 'text',
        content: [
          '',
          '  **Projects:**',
          '  ─────────',
          '  [1]  Linux Character Device Driver (Circular Queue)',
          '       ##→ Kernel module with efficient data buffering##',
          '                                          ',
          '',
          '  [2]  Smart MP3 Player',
          '       ##→ SD card-based audio player with watchdog timer##',
          '        ##and deep sleep power optimization.##',
          '                                          ',
          '',
          '  [3]   Mini Satellite Data Logger',
          '       ##→ Multi-sensor data acquisition + SD logging##',
          '                                          ',
          '',
          '  [4]  ESP32 Ambient LED System',
          '       ##→ Real-time edge color extraction & LED sync##',
          '                                          ',
          '',
          '  Type "project <number>" for detailed view.',
          '',
        ],
      };

    case 'project': {
      const width = getBoxWidth();
      const num = parseInt(parts[1]);
      const projectDetails: Record<number, string[]> = {
        
        1: createBox('**Project 1**', [
          // '',
          // '',
          'Linux Character Device Driver (Circular Queue)',
          '##Tech: C, Linux Kernel, Device Drivers##',
          '',
          'Developed a Linux loadable kernel module implementing a character device driver with a circular buffer for efficient data management.',
          '',
          'Enabled communication between user space and kernel space using file operations (read/write/ioctl).',
          '',
          'Implemented mutex-based synchronization to handle concurrent access and avoid race conditions.',
          '',
          'Implemented blocking I/O using wait queues.',
          '',
          'Link: [View Repo](https://github.com/Bharath8071/linux-chardevice-circular-queue)',
           ], width),

        2: createBox('**Project 2**', [
          // '',
          // '',
          'Smart MP3 Player',
          '##Tech: ESP32, Embedded C, SPI/I2C, SD Card, Bluetooth##',
          '',
          'Designed firmware using a state-based architecture to manage user input, playback control, and system flow.',
          '',
          'Implemented SD card file handling with structured navigation for audio data access and management.',
          '',
          'Integrated watchdog timer for fault recovery and system stability during runtime.',
          '',
          'Applied deep sleep and peripheral wake-up mechanisms to optimize power consumption.',
          '',
          'Developed a button-driven interface for real-time control and responsive interaction.',
          '',
          'Link: [View Repo](https://github.com/Bharath8071/smart-mp3-player)',
        ], width),
        
        3: createBox('**Project 3**', [
          // '',
          'Mini Satellite Data Logger',
          '##Tech: ESP32, LM35, DHT22, BMP280, SD Card##',
          '##\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0SIM868 (GPS + GSM), ThinkSpeak API##',
          '',
          'Designed a multi-sensor data acquisition system using ESP32 for continuous environmental monitoring.',
          '',
          'Implemented a structured data pipeline for acquisition, preprocessing, and storage of sensor data.',
          '',
          'Integrated multiple sensors (temperature, humidity, pressure, IMU) for real-time telemetry capture.',
          '',
          'Developed hybrid logging with SD card for offline storage and cloud transmission for remote monitoring.',
          '',
          'Link: [View Repo](https://github.com/Bharath8071/mini-satellite-data-logger)',
        ], width),
        
        4: createBox('**Project 4**',  [
            // '',
            // '',
            'Ambient Backlight Engine',
            '##Tech: Python, OpenCV, NumPy, K-Means, WS2812, Threads##',
            '',
            'Designed a real-time ambient lighting system using computer vision and clustering for screen-synced output.',
            '',
            'Implemented grid-based frame segmentation and edge-only processing to reduce computation and improve performance.',
            '',
            'Applied K-Means clustering to extract dominant colors from each region for accurate visual mapping.',
            '',
            'Optimized color processing using RGB ↔ HLS conversion for better lighting representation on LEDs.',
            '',
            'Designed a buffered update system with queue-based flow and multithreading for low-latency LED control.',
            '',
            'Controlled WS2812 LED strips for synchronized ambient lighting with minimal delay.',
            '',
            'Link: [View Repo](https://github.com/Bharath8071/ambient-backlight)',
           ], width),
      };
      if (projectDetails[num]) {
        return { type: 'text', content: projectDetails[num] };
      }
      return { type: 'text', content: ['', '  Error: Invalid project number. Type "projects" to see available projects.', ''] };
    }

    case 'experience': {
      const width = getBoxWidth();

      return {

        type: 'text',
        content: createBox('**Experience**', [

          // '▸ Freelance Embedded Developer',
          //   '\u00A0\u00A0Final Year Students & Early-Stage Startups',
          //   '\u00A0\u00A0Duration: 2025 – Present',
          //   '',
          //   '\u00A0• Designed and delivered embedded firmware solutions',
          //   '\u00A0including sensor-based systems and audio playback devices',
          //   '\u00A0• Collaborated directly with clients to translate hardware',
          //   '\u00A0 requirements into reliable, real-time firmware implementations',
          //   '\u00A0• Developed ESP32-based IoT and data logging systems with',
          //   '\u00A0  production-ready code.',
          //   '\u00A0• Performed debugging, testing, and system validation across',
          //   '\u00A0  hardware and firmware layers to ensure stability',
          //   '',      
          '▸ Embedded Systems Intern',
            '\u00A0\u00A0Radhva Motors (EV Company)',
            '\u00A0\u00A0Duration: July 2024',
            '',
            '\u00A0• Developed C modules for sensor interfacing',
            '\u00A0  and real-time data acquisition in EV systems',
            '\u00A0• Implemented CAN communication for reliable',
            '\u00A0  interaction between ECU subsystems',
            '\u00A0• Performed debugging and validation on real',
            '\u00A0  hardware environments',
            '\u00A0• Understood system-level integration of motors,',
            '\u00A0  battery management, and controllers',
            '',
            'Link: [Read Article](https://www.linkedin.com/posts/bharath-mani_internshipexperience-evtechnology-electricvehicles-ugcPost-7349281700255842305-gPP3?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD9f2ToBQWwgCvbT7NIG2V_APJWEcMRfa7g)',
            '',
          '▸ VLSI Design Intern',
            '\u00A0\u00A0SNS College of Technology × IIT Palakkad (C2S)',
            '\u00A0\u00A0Duration: June 2025',
            '',
            '\u00A0• Explored complete VLSI design flow from RTL',
            '\u00A0  to physical layout (GDSII)',
            '\u00A0• Designed RTL modules using Verilog HDL and',
            '\u00A0  worked with Cadence tools for circuit design',
            '\u00A0• Connected academic learning with real-world',
            '\u00A0  semiconductor workflows',
            '',
            'Link: [Read Article](https://www.linkedin.com/pulse/bridging-academia-industry-my-journey-through-vlsi-design-bharath-m-cjldc)',
                  
          ], width),
      };
    }

    case 'certs': {
      const width = getBoxWidth();
      
       return {
         type: 'text',
         content: createBox('**Certifications**', [ 
          '  ▸ AWS Academy – Generative AI Foundation',
          '\u00A0\u00A0\u00A0##• AI fundamentals, cloud-based model deployment##',
          '',
          '  ▸ Edge AI – Edge Impulse',
          '\u00A0\u00A0\u00A0##• TinyML, on-device ML inference, edge deployment##',
          '',
          '  ▸ LinkedIn Learning',
          '\u00A0\u00A0\u00A0##• Generative AI, MySQL (Data Management)##',
          '',
          '  ▸ PrepInsta',
          '\u00A0\u00A0\u00A0##• C Programming, Python Programming##',
        ], width),
        };
    }

    case 'contact': {
      const width = getBoxWidth();
      return {
        type: 'text',
        content: createBox('**Contact**', [
          'Email:    [bharathmani8071@gmail.com](mailto:bharathmani8071@gmail.com)',
          'LinkedIn: linkedin.com/in/bharath-mani',
          'GitHub:   github.com/Bharath8071',
          'Contact:  +91 9150198071',
          'Location: Coimbatore, India',
          ],width),
      };
    }

    case 'github':
      window.open('https://github.com/Bharath8071', '_blank');
      return { type: 'text', content: ['', '  Opening GitHub profile...', ''] };

    case 'linkedin':
      window.open('https://www.linkedin.com/in/bharath-mani', '_blank');
      return { type: 'text', content: ['', '  Opening LinkedIn profile...', ''] };

    // case 'resume': {
    //   const link = document.createElement('a');
    //   link.href = '/Bharath_Resume.pdf';
    //   link.download = 'Bharath_Resume.pdf';
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    
    //   return {
    //     type: 'text',
    //     content: ['', '  Downloading resume...', ''],
    //   };
    // }

    case 'resume':
      window.open('/Bharath_Resume.pdf', '_blank');
      return {
        type: 'text',
        content: ['', '  Opening resume...', ''],
      };
    return { type: 'text', content: ['', '  ⚠ Resume download will be available soon.', ''] };

    case 'clear':
      return { type: 'clear', content: [], next: 'neofetch' };

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
