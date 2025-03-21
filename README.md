<div align="center">
	<h1>CLEAN Nest.JS URL-SHORTNER</h1>
</div>

<br/>

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<br/>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">

<br/>

<div align="center">
  <a href="#page_facing_up-about">About</a> •
  <a href="#hammer_and_wrench-supported-os">Supported OS</a> • 
  <a href="#large_blue_diamond-design-patterns">Design Patterns</a> •
  <a href="#blue_book-principles">Principles</a> •
  <a href="#building_construction-business-rules">Business Rules</a> •
  <a href="#orange_book-adrs---architecture-decision-records">ADRs</a> •
  <a href="#clipboard-required-tools">Required Tools</a> •
  <a href="#racing_car-running-project">Running Project</a> •
  <a href="#test_tube-running-tests">Running Tests</a> •
  <a href="#memo-license">License</a>
</div>

## :page_facing_up: About

This a backend APP from a URL-SHORTENER Nest.JS typescript project.

It is a study project used to see how would be implemented a incremental version of a URL-SHORTENER.
The best approach for this problem it is not this one presented, again it is just a study repo !

To see an implementation using the incremental version see the branch "incremental-short-url"
To see an implementation using the incremental version, with sync data replication, see the branch "branch", W.I.P. (Work In Progress)

The objective from this project was to explore the framework by creating a well defined set of APIs with a decoupled architecture using Clean Architecture and D.D.D. - (Domain Driven Design) and exploring architecture capabilities like caching and design capabilities with several design patterns.

<br/>

## :hammer_and_wrench: Supported OS

- [x] Mac OS
- [x] Linux
- [x] Windows - WSL 

<br/>

## :large_blue_diamond: Design Patterns

### Creational

- [Factory Method](https://refactoring.guru/design-patterns/factory-method)
- [Singleton](https://refactoring.guru/design-patterns/singleton)

### Structural

- [Adapter](https://refactoring.guru/design-patterns/adapter)
- [Decorator](https://refactoring.guru/design-patterns/decorator)
- [Proxy](https://refactoring.guru/design-patterns/proxy)

<br/>

## :blue_book: Principles

- [Single Responsibility Principle (SRP)](https://en.wikipedia.org/wiki/Single-responsibility_principle)
- [Open Closed Principle (OCP)](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)
- [Liskov Substitution Principle (LSP)](https://en.wikipedia.org/wiki/Liskov_substitution_principle)
- [Interface Segregation Principle (ISP)](https://en.wikipedia.org/wiki/Interface_segregation_principle)
- [Dependency Inversion Principle (DIP)](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
- [Separation of Concerns (SOC)](https://en.wikipedia.org/wiki/Separation_of_concerns)
- [Don't Repeat Yourself (DRY)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
- [You Aren't Gonna Need It (YAGNI)](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)
- [Keep It Simple, Stupid (KISS)](https://en.wikipedia.org/wiki/KISS_principle)
- [Composition Over Inheritance](https://en.wikipedia.org/wiki/Composition_over_inheritance)

<br/>

## :building_construction: Business Rules

- **Clients**
  - [Create Account](https://github.com/gftf2011/url-shrtener/tree/main/docs/requirements/clients/create-account.md)
  - [Login](https://github.com/gftf2011/url-shrtener/tree/main/docs/requirements/clients/login.md)

- **Short URLs**
  - [Redirect](https://github.com/gftf2011/url-shrtener/tree/main/docs/requirements/short-urls/redirect.md)
  - [Create Short URL](https://github.com/gftf2011/url-shrtener/tree/main/docs/requirements/short-urls/create-short-url.md)
  - [Delete Short URL](https://github.com/gftf2011/url-shrtener/tree/main/docs/requirements/short-urls/delete-short-url.md)

<br/>

## :orange_book: ADRs - Architecture Decision Records

- ['Short URL' ID Definition](https://github.com/gftf2011/url-shortener/tree/main/docs/ADRs/short-url-id-definition.md)
- [Soft Delete](https://github.com/gftf2011/url-shortener/tree/main/docs/ADRs/soft-delete.md)
- [MySQL Core Databse](https://github.com/gftf2011/url-shortener/tree/main/docs/ADRs/mysql-core-database.md)
- [LRU Cache](https://github.com/gftf2011/url-shortener/tree/main/docs/ADRs/lru-cache.md)

<br/>

## :clipboard: Required Tools

- [x] Nest - [http://nestjs.com/](http://nestjs.com/)
  - Nest version: 10.3.2
- [x] Node - [https://nodejs.org/](https://nodejs.org/)
  - Node version: 20.11.0
  - npm version: 10.2.x
- [x] Docker - [https://www.docker.com/](https://www.docker.com/)

<br/>

## :racing_car: Running Project

**DEVELOPMENT**

```sh
  $ npm i
  $ npm run start:dev
```

**DEBUG**

```sh
  $ npm i
  $ npm run start:debug
```

OBS.: After the server is UP and Running use __api.http__ file to do your requests using **VS Code**

<br/>

## :test_tube: Running Tests

> ### Full Test
```sh
  $ npm run test
```

<br/>

## :memo: License

This project is under MIT license. See the [LICENSE](https://github.com/gftf2011/url-shortener/blob/main/LICENSE) file for more details.

---

Made with lots of :heart: by [Gabriel Ferrari Tarallo Ferraz](https://www.linkedin.com/in/gabriel-ferrari-tarallo-ferraz/)
