/// <reference types="cypress" />

describe("Menu", () => {
    it("should have all expected elements", () => {
        cy.visit("http://localhost:8000/");

        cy.get("#MainCanvas");
        cy.get("#DrawCanvas");
        cy.get("#ColorPicker");
        cy.get("#BrushesContainer");
        cy.get("#SaveCanvas");
        cy.get("#EraseMode");
        cy.get("#OpenSettings");
    });
});
