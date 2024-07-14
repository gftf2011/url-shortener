# Decision record template by Michael Nygard

This is the template in [Documenting architecture decisions - Michael Nygard](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions).
You can use [adr-tools](https://github.com/npryce/adr-tools) for managing the ADR files.

In each ADR file, write these sections:

# MySQL Core Database

## Status

accepted

## Context

For the problem of building a Tiby URL clone using the generation of incrementally UNIQUE IDs was decided to use a Database that would support a Single-Leader Replication due to the writing operations nature where the READ/WRITE Factor would be around 100:1

## Decision

So was decided to use as the Core Database that would store the short-urls a SQL Database like MySQL since the integrity of data would be important and the we're handling structured-data types

## Consequences

As a consequence we can maintain a strong data integrity and the scalability can be managed since the application expects more READS than WRITES
