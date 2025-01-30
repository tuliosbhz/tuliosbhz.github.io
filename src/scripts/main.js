// This file contains the JavaScript code for the webpage. It handles interactivity and dynamic content.

document.addEventListener('DOMContentLoaded', () => {
    const themeButton = document.getElementById('changeThemeButton');
    const projectGrid = document.querySelector('.project-grid');
    const heroTitle = document.querySelector('#hero h2');
    const heroDescription = document.querySelector('#hero p');

    const themes = {
        dark: {
            hero: {
                title: "Innovating EV Charging Solutions",
                description: "Building the future of sustainable transportation through advanced embedded systems"
            },
            projects: [
                {
                    title: "AC charging station Hardware Retrofitting",
                    description: "Hardware Retrofitting of IEC 61851-1 and addition of HomePlugGreen PHY Communication Controller ISO 15118-3 compliant",
                    tech: ["C++", "IEC61851-1", "QCA7000", "HomePlugGreen PHY", "ISO 15118-3"]
                },
                {
                    title: "AC charging station Software Refactoring",
                    description: "Refactoring of a C++ codebase to C language to support ISO 15118-2 available library OpenV2G",
                    tech: ["C", "ISO 15118-2", "OpenV2G", "C++"]
                },
                {
                    title: "ISO 15118 Implementation",
                    description: "Led the implementation of ISO 15118 standard for basic vehicle-to-grid communication with OpenV2G library on Raspberry Pi Zero W",
                    tech: ["C", "ISO 15118", "OpenV2G", "TCP/IP", "HPGP", "Raspberry Pi Zero W"]
                },
                {
                    title: "Smart Charging Station Software Development",
                    description: "Refactoring of C codebase for IEC 61851-1 to keep efficiency and HW PWM, and refactoring of Python with addition of smart charging functionalities and connection with OCPP 2.0 and database addition for managing charging sessions with SQL and ORM alchemy library in python",
                    tech: ["Python", "C", "OCPP 2.0", "SQL", "ORM Alchemy", "Raspberry Pi 3B"]
                },
                {
                    title: "Distributed Charging Station Management System with OCPP and Raft",
                    description: "As part of my master thesis, I developed a distributed charging station management system with OCPP and Raft consensus algorithm to manage the charging stations in a smart grid environment",
                    tech: ["Python", "OCPP 2.0", "Raft", "Charging Infrastructures"]
                }
            ]
        },
        light: {
            hero: {
                title: "Software Development Portfolio",
                description: "Crafting elegant solutions through code - Full Stack & Embedded Systems Developer"
            },
            projects: [
                {
                    title: "Personal Portfolio Website",
                    description: "Modern, responsive portfolio website built with vanilla JavaScript and CSS. Features theme switching and dynamic content loading.",
                    tech: ["JavaScript", "CSS", "HTML5", "Responsive Design"]
                },
                {
                    title: "Authentication System for Charging Station Infrastructure of INESC TEC",
                    description: "As part of the charging stations that I developed for INESC TEC, I developed an authentication system for the charging stations to connect to the charging station management system using a QR Code and a registration on the browser of the smartphones using REACT, Fast API and ORM SQLAlchemy",
                    tech: ["Python", "React", "Fast API", "SQLAlchemy"]
                },
                {
                    title: "Embedded Systems Projects on University of Porto",
                    description: "Collection of personal projects including IoT devices, and microcontroller programming.",
                    tech: ["Python", "Arduino", "ESP32", "IoT"]
                }
            ]
        }
    };

    function updateContent(theme) {
        // Update hero section
        heroTitle.textContent = themes[theme].hero.title;
        heroDescription.textContent = themes[theme].hero.description;

        // Update projects
        projectGrid.innerHTML = themes[theme].projects.map(project => `
            <div class="project-card">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="tech-stack">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    // Initial content setup
    updateContent('dark');

    // Theme switching
    themeButton.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        const theme = isLight ? 'light' : 'dark';
        
        themeButton.textContent = isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme';
        updateContent(theme);
    });
});

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}