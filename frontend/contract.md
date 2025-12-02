# Projekt-Contract

Dieses Dokument beschreibt den minimalen Contract zwischen Frontend (Angular) und Backend (GraphQL).

- GraphQL Endpoint: https://localhost:8443/graphql  # anpassen falls anders
- Auth: Keycloak (OIDC) für geschützte Mutations (create, update, delete). Rolle: `admin` für Schreibrechte.
- Public Queries: searchBooks(query, filters, page, size) -> BookPage
- Detail Query: bookById(id: ID!) -> Book
- Mutations: createBook(input: CreateBookInput) -> Book, updateBook(id: ID!, input: UpdateBookInput) -> Book

Datamodel (DTOs) - vereinfachte Version:

type Book {
  id: ID!
  title: String!
  authors: [String!]
  isbn: String
  pages: Int
  publishedAt: String
}

input CreateBookInput {
  title: String!
  authors: [String!]
  isbn: String
  pages: Int
  publishedAt: String
}

input UpdateBookInput {
  title: String
  authors: [String!]
  isbn: String
  pages: Int
  publishedAt: String
}

Fehlercodes:
- UNAUTHORIZED: User nicht eingeloggt
- FORBIDDEN: User hat nicht die nötige Rolle
- VALIDATION_ERROR: Ungültige Eingabedaten

Weitere Anpassungen: Sobald das Backend genauer bekannt ist (Schema), aktualisiere ich dieses Dokument mit exakten Query/Mutation-Beispielen (GQL-Operationen).
