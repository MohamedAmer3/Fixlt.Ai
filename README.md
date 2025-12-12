# ⚡ FixIt.AI: Autonomous Repair System

> **Turn broken objects into 3D-printable repairs instantly using Gemini 3 Pro.**

[![Built with Gemini 3 Pro](https://img.shields.io/badge/Built%20with-Gemini%203%20Pro-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Vibe Coding](https://img.shields.io/badge/Vibe-Coding-FF6B00?style=for-the-badge)](https://kaggle.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br />

<div align="center">
  <img src="https://github.com/user-attachments/assets/YOUR_IMAGE_LINK_HERE" alt="FixIt.AI Dashboard" width="100%">
  <p><em>From Broken Part (Input) -> To Printable STL (Output) in < 60 seconds.</em></p>
</div>

## 🛠️ The Problem
Every year, millions of repairable devices end up in landfills simply because a single plastic gear or bracket snapped. 
* **No Spare Parts:** Manufacturers rarely sell individual internal components.
* **High Skill Barrier:** Designing a replacement part in CAD (Fusion 360, SolidWorks) takes hours of skill that most consumers don't have.

## 💡 The Solution: FixIt.AI
**FixIt.AI** is a "Vibe Coded" web application that democratizes mechanical engineering. By leveraging the **spatial reasoning** and **logic capabilities** of **Gemini 3 Pro**, it allows anyone to:
1.  **Scan:** Upload a photo of a broken part.
2.  **Analyze:** The AI identifies the mechanical failure and estimates metric dimensions (e.g., M3 screw holes).
3.  **Engineer:** It writes parametric **OpenSCAD code** to generate a *reinforced* replacement.
4.  **Fabricate:** It renders a live 3D preview in the browser and exports a watertight `.STL` file ready for 3D printing.

## 🚀 Key Features

### 1. Multimodal "Visual Repair"
FixIt.AI doesn't just "see" an image; it understands geometry. It detects:
* Standard hardware sizes (screws, rods).
* Fracture points in plastic.
* Structural weaknesses requiring reinforcement.

### 2. Live "Vibe" Coding
The entire UI and logic were generated using Gemini 3 Pro's "Vibe Coding" capabilities.
* **Scanner V1:** A responsive drag-and-drop interface with a segmented status visualization.
* **Logic Core:** Displays the AI's "Chain of Thought" as it calculates the repair strategy.
* **Fabricator V1:** A real-time **Three.js** viewport to inspect the generated mesh.

### 3. Dual-Format Export
* **DOWNLOAD .STL:** Binary file ready for slicers (Cura, PrusaSlicer).
* **EXPORT .SCAD:** Parametric source code for advanced users to tweak in OpenSCAD.

## 🏗️ Tech Stack
* **AI Model:** Google Gemini 3 Pro (Preview)
* **Frontend:** HTML5, CSS Grid (Cyberpunk UI Theme)
* **Visualization:** `Three.js` + `STLExporter`
* **Logic:** Javascript (Client-Side)

## 📸 Demo
*(Add a link to your YouTube video here or a GIF of the scanning process)*

## 🧠 The "Magic" Prompt
The core of this application runs on a specialized system prompt designed to force Gemini into "Engineering Mode":

> "You are an expert Additive Manufacturing Engineer. ANALYZE the broken feature. MEASURE logical metric dimensions. STRATEGY: Do not just trace the broken shards; DESIGN A REPLACEMENT. Create Parametric OpenSCAD code and ensure the part is MANIFOLD and has a flat surface for bed adhesion."

## 📦 How to Run
Since this is a client-side "Vibe App," you can run it directly:
1.  Clone the repo.
2.  Open `index.html` in any modern browser.
3.  Add your Google AI Studio API Key (if running locally).

## 🏆 Kaggle Competition
This project was built for the **Google DeepMind Gemini 3 Vibe Code Competition**.
* **Track:** Overall Impact & Creativity.
* **Theme:** "Right to Repair" / Sustainability.

---
*Built with 💙 by Mohamed Amer Eid*
