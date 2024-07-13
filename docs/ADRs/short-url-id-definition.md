# Decision record template by Michael Nygard

This is the template in [Documenting architecture decisions - Michael Nygard](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions).
You can use [adr-tools](https://github.com/npryce/adr-tools) for managing the ADR files.

In each ADR file, write these sections:

# 'Short-Url' id definition

## Status

accepted

## Context

As we're building a URL shortener, we need to generate 'short-urls' links to redirect the final client to the web page mapped by the 'short-url'.
For this we need a way to generate UNIQUE IDs for every URL that is being shortened. Considering that we could store URLs for a 'long time period of time'.

## Decision

The decision for this would be, and imagining that the system has a HIGH volume of daily requests, we decided the ID would be a 10 character string in [BASE 36](https://en.wikipedia.org/wiki/Base36).

By doing it we can generate 36^10 number of IDs !

## Consequences

Using a NON-optimistic approach in database !

By using a UNIQUE ID for every URL, even if the URL is the same. As a consequence we need to deal with concurrency in database and use a lock to read AND write to garantee that each ID is Incrementally UNIQUE !
