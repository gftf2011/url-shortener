# Decision record template by Michael Nygard

This is the template in [Documenting architecture decisions - Michael Nygard](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions).
You can use [adr-tools](https://github.com/npryce/adr-tools) for managing the ADR files.

In each ADR file, write these sections:

# Soft Delete

## Status

accepted

## Context

As we're building a URL shortener, with high volume of requests using a SQL database. We wanna avoid the database process time as much as possible.

## Decision

To avoid unnecessary processing in the database, since we are using a B-TREE index for the table in question, we are going to use a soft-delete
technique to preserve data and avoid the tree reconstruction when using the DELETE Command.

## Consequences

As a consequence we'll be keeping all the data created in the database storage, but we'll be avoiding the binary tree rebalance !
