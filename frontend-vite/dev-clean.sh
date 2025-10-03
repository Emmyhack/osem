#!/bin/bash

# Clean development server that filters out sourcemap warnings
npm run dev 2>&1 | grep -v "Sourcemap for.*points to missing source files" | grep -v "^$"