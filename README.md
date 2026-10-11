# NodeMCU Wiring Guide

An interactive beginner-friendly wiring guide for a potentiometer-controlled LED using an ESP8266 NodeMCU V3.

## Use the guide

Select a component, wire or printed pin label to see the exact board-to-breadboard endpoints. The guide also explains jumper connector types, soldered headers, connected breadboard strips and checks before power. The brightness slider demonstrates the idea in your browser. The physical board needs a separate matching program that reads A0 and drives D5 / GPIO14.

## Example hardware

- ESP8266 NodeMCU V3 with the shown 30-pin layout
- 10 kΩ potentiometer with suitable breadboard leads
- 5 mm LED
- 220 Ω resistor
- Breadboard
- Five male–female jumpers for the illustrated soldered-male-header board beside the breadboard

Check the printed labels on your own board. The complete potentiometer example requires an A0 input verified for the full 0–3.3 V range. The bare ESP8266 ADC accepts only 0–1 V; board-level dividers vary. Keep USB disconnected while wiring, and verify your exact board before power. Flat potentiometer tabs or different pin layouts need a revised mounting/wiring plan.

## Technology

Plain HTML, CSS, JavaScript and SVG. No build step, database, login or external dependencies. Setup choices are stored in your browser.

## Run locally

From the repository folder, run `python -m http.server 8000`, then open `http://localhost:8000`. Stop the server with Ctrl+C.

## Publish with GitHub Pages

In the repository, open **Settings → Pages**. Choose **Deploy from a branch**, select the default branch and **/(root)**, then save. The repository root contains `index.html` and all required assets.

## Validation

The source was checked for JavaScript syntax, pin order and circuit connections, compatibility/readiness checks, local assets and interactive behavior using a DOM harness. Responsive CSS and mobile selection behavior were checked. Live mobile browser testing remains unverified.

## References

- [ESP8266 Arduino Core: analog limits and PWM](https://arduino-esp8266.readthedocs.io/en/latest/reference.html)
- [ESP8266 boards and pin mappings](https://arduino-esp8266.readthedocs.io/en/latest/boards.html)
