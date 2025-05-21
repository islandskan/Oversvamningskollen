import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import LoginScreen from "@/app/login";
import { showAlert } from "@/utils/alert";

// Mock dependencies
jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}));

// Mock useAuth hook
const mockLogin = jest.fn();
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

jest.mock("@/utils/alert", () => ({
  showAlert: jest.fn(),
}));

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLogin.mockReset();
  });

  it("shows validation error when submitting empty form", () => {
    const { getByText } = render(<LoginScreen />);

    fireEvent.press(getByText("Sign In"));

    expect(showAlert).toHaveBeenCalledWith(
      "Missing Information",
      "Please enter both email and password",
      "warning"
    );
  });

  it("shows validation error when email is empty", () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Password"), "password123");

    fireEvent.press(getByText("Sign In"));

    expect(showAlert).toHaveBeenCalledWith(
      "Missing Information",
      "Please enter both email and password",
      "warning"
    );
  });

  it("shows validation error when password is empty", () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");

    fireEvent.press(getByText("Sign In"));

    expect(showAlert).toHaveBeenCalledWith(
      "Missing Information",
      "Please enter both email and password",
      "warning"
    );
  });

  it("calls login function with correct credentials when form is valid", async () => {
    mockLogin.mockResolvedValue(undefined);

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");

    fireEvent.press(getByText("Sign In"));

    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
  });

  it("navigates to home screen on successful login", async () => {
    mockLogin.mockResolvedValue(undefined);

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");

    fireEvent.press(getByText("Sign In"));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/(tabs)");
    });
  });

  it("navigates to signup screen when Sign Up is pressed", () => {
    const { getByText } = render(<LoginScreen />);

    fireEvent.press(getByText("Sign Up"));

    expect(router.push).toHaveBeenCalledWith("/signup");
  });
});
