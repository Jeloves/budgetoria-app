import { CreateAccountSubpage } from "@/features/accounts-page/create-account-subpage/create-account-subpage";
import { Account } from "@/firebase/models";

describe("<CreateAccountSubpage />", () => {
	beforeEach(() => {
		cy.mount(<CreateAccountSubpage handleBackClick={() => {}} handleCreateAccount={() => {}} />);
	});

	context("Header content", () => {
		it("shows the correct first header button icon", () => {
			cy.get("header img").should("have.attr", "src", "/icons/arrow-left-grey-100.svg");
		});

		it('shows "Create Account" header text', () => {
			cy.get("header span").should("have.text", "Create Account");
		});

		it('shows "Finish" as the second header button label', () => {
			cy.get("header button").eq(1).should("have.text", "Finish");
		});
	});

	context("Inputs", () => {
		it("shows the correct input labels", () => {
			cy.get("main label").eq(0).should("have.text", "Enter a name for the account");
			cy.get("main label").eq(1).should("have.text", "Enter the starting balance for the account");
		});

		it("shows the correct input placeholders", () => {
			cy.get("main input").eq(0).should("have.attr", "placeholder", "Account name...");
			cy.get("main input").eq(1).should("have.attr", "placeholder", "$0.00");
		});

		it("initially shows empty inputs", () => {
			cy.get("main input").eq(0).should("have.value", "");
			cy.get("main input").eq(1).should("have.value", "");
		});

        it("types correct account name", () => {
            const nameToType = "Checkings";
            cy.get("main input").eq(0).type(nameToType);
            cy.get("main input").eq(0).should("have.value", nameToType);
        })

		it("properly formats currency inputs", () => {
			cy.get("main input")
				.eq(1)
				.type("1a2b3c4d5e.f6g7h8i{backspace}{backspace}9j1k0")
				.then(() => {
					cy.get("main input").eq(1).should("have.value", "$12345.91");
				});
		});
	});

	context("Outflow / Inflow buttons", () => {
		const colorUnselected = "rgba(0, 0, 0, 0)";
		const colorGreen = "#11a331";
		const colorRed = "#ff0000";

        function hexToRGB(hex: string) {
            let r = 0, g = 0, b = 0;
        
            // If the hex code is in the shorthand format (#RGB), expand it to the full format (#RRGGBB)
            if (hex.length === 4) {
                r = parseInt(hex[1] + hex[1], 16);
                g = parseInt(hex[2] + hex[2], 16);
                b = parseInt(hex[3] + hex[3], 16);
            } else if (hex.length === 7) {
                r = parseInt(hex[1] + hex[2], 16);
                g = parseInt(hex[3] + hex[4], 16);
                b = parseInt(hex[5] + hex[6], 16);
            }
        
            return `rgb(${r}, ${g}, ${b})`;
        }

		it("initially highlights inflow icon", () => {
			cy.get('[data-test-id="outflow-button"]').should("have.css", "background-color", colorUnselected);
			cy.get('[data-test-id="inflow-button"]').should("have.css", "background-color", hexToRGB(colorGreen));
		});

		it("does not change when selected button is clicked again", () => {
			cy.get('[data-test-id="inflow-button"] button').click();
			cy.get('[data-test-id="outflow-button"]').should("have.css", "background-color", colorUnselected);
			cy.get('[data-test-id="inflow-button"]').should("have.css", "background-color", hexToRGB(colorGreen));
		});

		it("highlights outflow icon when clicked", () => {
			cy.get('[data-test-id="outflow-button"] button').click();
			cy.get('[data-test-id="outflow-button"]').should("have.css", "background-color", hexToRGB(colorRed));
			cy.get('[data-test-id="inflow-button"]').should("have.css", "background-color", colorUnselected);

			cy.get('[data-test-id="outflow-button"] button').click();
			cy.get('[data-test-id="outflow-button"]').should("have.css", "background-color", hexToRGB(colorRed));
			cy.get('[data-test-id="inflow-button"]').should("have.css", "background-color", colorUnselected);
		});
	});
});
