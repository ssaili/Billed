/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import mockStore from "../__mocks__/store"
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES } from "../constants/routes.js";


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "a@a",
        })
      );
    });

    test("Then it should display new bill form, inputs and submit button", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      const newBillForm = screen.getByTestId("form-new-bill");
      expect(newBillForm).toBeTruthy();

      const typeInput = screen.getByTestId("expense-type");
      expect(typeInput).toBeTruthy();

      const nameInput = screen.getByTestId("expense-name");
      expect(nameInput).toBeTruthy();

      const dateInput = screen.getByTestId("datepicker");
      expect(dateInput).toBeTruthy();

      const amountInput = screen.getByTestId("amount");
      expect(amountInput).toBeTruthy();

      const vatInput = screen.getByTestId("vat");
      expect(vatInput).toBeTruthy();

      const pctInput = screen.getByTestId("pct");
      expect(pctInput).toBeTruthy();

      const commentaryInput = screen.getByTestId("commentary");
      expect(commentaryInput).toBeTruthy();

      const fileInput = screen.getByTestId("file");
      expect(fileInput).toBeTruthy();

      const submitBtn = document.querySelector("#btn-send-bill");
      expect(submitBtn).toBeTruthy();
    })
    test("Then user upload an allowed extension file", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage,
      });

      const handleChangeFile = jest.fn(newBill.handleChangeFile);

      const file = screen.getByTestId("file");

      window.alert = jest.fn();

      file.addEventListener("change", handleChangeFile);

      fireEvent.change(file, {
        target: {
          files: [new File(["file.png"], "file.png", { type: "image/png" })],
        },
      });

      expect(handleChangeFile).toHaveBeenCalled();

      jest.spyOn(window, "alert");
      expect(alert).not.toHaveBeenCalled();
    })

    test("Then user upload an incorrect extension file", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage,
      });

      const handleChangeFile = jest.fn(newBill.handleChangeFile);

      const file = screen.getByTestId("file");

      window.alert = jest.fn();

      file.addEventListener("change", handleChangeFile);

      fireEvent.change(file, {
        target: {
          files: [new File(["file.pdf"], "file.pdf", { type: "document/pdf" })],
        },
      });

      expect(handleChangeFile).toHaveBeenCalled();

      jest.spyOn(window, "alert");
      expect(alert).toHaveBeenCalled();
    })

    test("Then user submit a valid form", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage,
      });

      const formNewBill = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn(newBill.handleSubmit);
      formNewBill.addEventListener("submit", handleSubmit);
      fireEvent.submit(formNewBill);

      expect(handleSubmit).toHaveBeenCalled();
    })
  })
})

describe("When I navigate to Dashboard employee", () => {
  describe("Given I am a user connected as Employee, and a user post a newBill", () => {
    test("Add a bill from mock API POST", async () => {
      const postSpy = jest.spyOn(mockStore, "bills");
      const bill = {
        id: "47qAXb6fIm2zOKkLzMro",
        vat: "80",
        fileUrl:
          "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        status: "pending",
        type: "Hôtel et logement",
        commentary: "séminaire billed",
        name: "encore",
        fileName: "preview-facture-free-201801-pdf-1.jpg",
        date: "2004-04-04",
        amount: 400,
        commentAdmin: "ok",
        email: "a@a",
        pct: 20,
      };
      const postBills = await mockStore.bills().update(bill);
      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(postBills).toStrictEqual(bill);
    });
  })
})
