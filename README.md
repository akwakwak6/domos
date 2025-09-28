# Domos

Build and run Home Assistant automations in TypeScript with a vs code style in web UI. Domos uses the Home Assistant Device SDK to strongly type your devices and services and generates a typed client (`ha.ts`).

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2024%2B-41BDF5?logo=home-assistant&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-20%2B-2496ED?logo=docker&logoColor=white)

---

## Table of contents

-   **[Overview](#overview)**
-   **[Features](#features)**
-   **[Quick start](#quick-start)**
-   **[Prerequisites](#prerequisites)**
-   **[Project layout](#project-layout)**
-   **[Troubleshooting](#troubleshooting)**
-   **[Roadmap](#roadmap)**
-   **[Contributing](#contributing)**
-   **[License](#license)**

## Overview

Domos is a lightweight environment to author, build, and run Home Assistant automations in TypeScript. It connects to your Home Assistant instance, discovers devices, and generates a fully typed client (`ha.ts`) you can use directly in your automations.

SDK repo: https://github.com/akwakwak6/home-assistant-device-sdk

## Features

-   **Typed SDK generation** – One‑click Sync to generate `ha.ts` with typed entities and services from your Home Assistant.
-   **Code‑focused web UI** – Edit and publish automations from a browser‑based editor.
-   **Containerized** – Run via Docker, mount your local workspace at `./app`.

## Quick start

### 1) Start the container

Run this from your project directory. It mounts `./app` into the container and exposes the web UI on port `3000`.

```bash
docker run -it --rm \
  -v ./app:/app/workdir \
  -p 3000:3000 \
  ghcr.io/akwakwak6/domos
```

Then open http://localhost:3000 in your browser.

### 2) Log in to Home Assistant

Provide your Home Assistant base URL and a Long‑Lived Access Token in the web UI. You can create a token in Home Assistant under your user profile.

### 3) Click “Sync”

Use the Sync action to connect and generate a typed SDK file named `ha.ts`. It contains typed entities and services for your instance.

### 4) Edit automations in TypeScript

Open `src/demo.ts` in the editor (inside the mounted workspace) and use the generated `ha` client to write your logic.

### 5) Publish and run

Click “Publish” to build and start your automations. The runner compiles and executes your code against Home Assistant.

## Prerequisites

-   **Docker** 20+
-   **Home Assistant** reachable from the container
-   **Long‑Lived Access Token** created from your Home Assistant user profile
-   A local folder `./app` to persist your workspace and generated files

## Project layout

With `-v ./app:/app/workdir`, your workspace typically contains:

```
app/
  src/
    demo.ts          # Example automation
  ha.ts              # Generated typed SDK (after Sync)
  package.json       # Your project dependencies/scripts
  index.ts           # Entry point
  tsconfig.json      # TypeScript configuration
```

## Troubleshooting

-   **`ha.ts` not generated** – Ensure the base URL and token are correct, then click Sync again. Check the UI logs for errors.
-   **Cannot access UI** – Verify the port mapping `-p 3000:3000` and browse to `http://localhost:3000`.
-   **Changes not persisted** – Confirm the host folder `./app` exists before running Docker and that it’s mounted correctly.

## Roadmap

-   Additional code templates/examples
-   Improved diagnostics in the UI
-   First‑class Docker Compose support

## Contributing

Issues and PRs are welcome. For large changes, please open an issue first to discuss what you’d like to build.

## License

MIT ©

@Akwa
