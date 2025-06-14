#!/usr/bin/env node
/**
 * ShadowX Start Script
 * 
 * This script provides a simple entry point that redirects to the main server file.
 * Usage: node start.js
 * 
 * This allows for consistent startup across different hosting platforms
 * and provides a clean entry point for production deployments.
 */

import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine the correct server file based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
const distPath = path.join(__dirname, 'dist', 'index.js');
const hasDistFile = fs.existsSync(distPath);

// Choose appropriate file and command
let serverFile, command;

if (isDevelopment || !hasDistFile) {
  // Development mode or no built file available
  serverFile = path.join(__dirname, 'server', 'index.ts');
  command = 'tsx';
  console.log('Running in development mode with tsx...');
} else {
  // Production mode with built file
  serverFile = distPath;
  command = 'node';
  console.log('Running in production mode...');
}
const args = [serverFile];

console.log(`Starting ShadowX server...`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Command: ${command} ${serverFile}`);

// Spawn the server process
const serverProcess = spawn(command, args, {
  stdio: 'inherit',
  env: process.env
});

// Handle process events
serverProcess.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT. Gracefully shutting down...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM. Gracefully shutting down...');
  serverProcess.kill('SIGTERM');
});