interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string;
          callback: (response: { credential: string }) => void;
          cancel_on_tap_outside?: boolean;
        }) => void;
        prompt: (momentListener?: (moment: string) => void) => void;
        renderButton: (
          element: HTMLElement,
          options: {
            type?: "standard" | "icon";
            theme?: "outline" | "filled_blue" | "filled_black";
            size?: "large" | "medium" | "small";
            text?: "signin_with" | "signup_with" | "continue_with" | "signin";
            shape?: "rectangular" | "pill" | "circle" | "square";
            logo_alignment?: "left" | "center";
            width?: string;
          }
        ) => void;
        disableAutoSelect: () => void;
        cancel: () => void;
      };
    };
  };
}
