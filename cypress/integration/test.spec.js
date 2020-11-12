/// <reference types="cypress" />

describe("Menu", () => {
    it("should have all expected elements", () => {
        cy.visit("http://localhost:8000/");

        cy.get("#mainCanvas");
        cy.get("#drawCanvas");
        cy.get("#ColorPicker");
        cy.get("#BrushesContainer");
        cy.get("#saveCanvas");
        cy.get("#erase");
        cy.get("#clearCanvas");
        cy.get("#exportCanvas");
    });
});
