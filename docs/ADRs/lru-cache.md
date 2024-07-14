# Decision record template by Michael Nygard

This is the template in [Documenting architecture decisions - Michael Nygard](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions).
You can use [adr-tools](https://github.com/npryce/adr-tools) for managing the ADR files.

In each ADR file, write these sections:

# LRU Cache

## Status

accepted

## Context

We are going to use cache data since most of cliets are going to access the same URLs which means that 80% of request volumes will go to hot URLs tha correspond to 20% of the short-urls stored

## Decision

Which means that we can use a LRU eviction cache policy, normally a doubly-linked list

## Consequences

As a consequence we can always keep the most used data in cache to retrieve the information as fast as we can to keep the application with a good throughput.
