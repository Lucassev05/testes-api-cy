/// <reference types="cypress" />
import contrato from "../contracts/usuarios.contract";
const faker = require("faker-br");

describe("Testes da Funcionalidade Usuários", () => {
  it("Deve validar contrato de usuários", () => {
    cy.request("usuarios").then((response) => {
      return contrato.validateAsync(response.body);
    });
  });

  it("Deve listar usuários cadastrados", () => {
    cy.request("usuarios").then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("usuarios");
      expect(response.duration).to.be.lessThan(20);
    });
  });

  it("Deve cadastrar um usuário com sucesso", () => {
    const novoUsuario = {
      nome: faker.name.findName(),
      email: faker.internet.email(),
      password: "teste",
      administrador: "true",
    };

    cy.cadastrarUsuario(novoUsuario).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal("Cadastro realizado com sucesso");
    });
  });

  it("Deve validar um usuário com email inválido", () => {
    const novoUsuario = {
      nome: faker.name.findName(),
      email: "levangelista@gmail",
      password: "teste",
      administrador: "true",
    };
    cy.cadastrarUsuario(novoUsuario).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.email).to.equal("email deve ser um email válido");
    });
  });

  it("Deve editar um usuário previamente cadastrado", () => {
    //TODO:
    cy.request("usuarios").then((response) => {
      const usuarioId = response.body.usuarios[0]._id;
      const novosDados = {
        nome: faker.name.findName(),
        email: faker.internet.email(),
        password: "teste",
        administrador: "true",
      };

      cy.editarUsuario(usuarioId, novosDados).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Registro alterado com sucesso");
      });
    });
  });

  it("Deve deletar um usuário previamente cadastrado", () => {
    cy.request("usuarios").then((response) => {
      const usuarioId = response.body.usuarios[0]._id;
      cy.deletarUsuario(usuarioId).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Registro excluído com sucesso");
      });
    });
  });
});
