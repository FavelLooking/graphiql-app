import { prettifyQuery } from "../prettifyQuery";

describe("prettifyQuery", () => {
  test("форматирует простой запрос", () => {
    const input = "query { field }";
    const expected = `query {
  field
}`;
    expect(prettifyQuery(input)).toBe(expected);
  });

  test("форматирует запросы с алиасами и фрагментами", () => {
    const input = `
    query {
      user1: user(id:1) {
        ...userFields
      }
      user2: user(id:2) {
        ...userFields
      }
    }
    fragment userFields on User {
      id
      name
    }
    `;
    const expected = `query {
  user1: user(id:1) {
    ...userFields
  }
  user2: user(id:2) {
    ...userFields
  }
}
fragment userFields on User {
  id
  name
}`;
    expect(prettifyQuery(input)).toBe(expected);
  });

  test("обрабатывает пустую строку", () => {
    const input = "";
    const expected = "";
    expect(prettifyQuery(input)).toBe(expected);
  });

  test("обрабатывает строку с пробелами", () => {
    const input = "   ";
    const expected = "";
    expect(prettifyQuery(input)).toBe(expected);
  });

  test("обрабатывает комментарии", () => {
    const input = `
    # Это комментарий
    query { 
      field 
    } 
    `;
    const expected = `# Это комментарий
query {
  field
}`;
    expect(prettifyQuery(input)).toBe(expected);
  });

  test("не изменяет уже отформатированный запрос", () => {
    const input = `query {
  field
}`;
    const expected = `query {
  field
}`;
    expect(prettifyQuery(input)).toBe(expected);
  });

  test("форматирует сложный запрос", () => {
    const input = `
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        name
        posts {
          id
          title
          comments {
            id
            content
          }
        }
      }
    }
    `;
    const expected = `query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    posts {
      id
      title
      comments {
        id
        content
      }
    }
  }
}`;
    expect(prettifyQuery(input)).toBe(expected);
  });
});
