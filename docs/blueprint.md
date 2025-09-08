# **App Name**: PII Sentinel

## Core Features:

- PII Detection via NER: Detect PII entities (names, emails, addresses, etc.) from CSV file columns using spaCy. Results are returned in JSON format, with entity type, location, and confidence score.
- Proximity Analysis: Analyze the text surrounding identified entities to infer additional PII based on context.  A tool returns inferred risk levels (low/medium/high).
- PII Graph Visualization: Build an entity graph representing detected PII entities and their co-occurrences using networkx. Provides graph analysis results such as connected components and centrality, in JSON format.
- PII Masking: Mask detected PII in the input CSV file by replacing sensitive values with asterisks (***).
- LangGraph Integration: Combines the NER detector, proximity analyzer, and graph builder into a LangGraph agent pipeline for orchestrated PII detection and masking.
- Comprehensive Reporting: Generates a detailed report in JSON format, including detected PII entities, their types, locations, confidence scores, inferred risk levels, and graph analysis results.
- CSV File Handling: Enables the agent to ingest and process CSV files with arbitrary columns containing structured and unstructured text.

## Style Guidelines:

- Primary color: Strong purple (#9D4EDD) to convey security and authority.
- Background color: Light gray (#E9ECEF), close to white, for a clean, neutral background.
- Accent color: Cyan (#29ABE2), a lighter analogous color to the primary, to highlight important elements without overwhelming the design.
- Body and headline font: 'Inter', a grotesque-style sans-serif known for being modern, objective, and neutral.
- Use clear, simple icons for PII types (e.g., email, address) to aid quick identification.  Icons should be related to security such as padlocks, shields, and keys, following a consistent style.
- Employ a clean and structured layout for the report and masked CSV output. Use distinct sections for detected entities, proximity analysis results, and graph analysis insights. Make tabular data easily readable.
- Subtle animations or transitions when displaying results or navigating between sections to improve user experience. For instance, a loading animation while processing CSV data.