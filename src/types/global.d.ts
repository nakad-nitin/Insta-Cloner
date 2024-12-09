export {};

declare global {
  interface Window {
    debug: boolean;
  }

  export type VariablePayload = {
    mainImg: string;
    alt: string;
    MainIndex: number;
    index: number;
  };

  export type ConstantPayload = {
    time: string;
    userName: string;
    postContent: string;
  };

  export type PayloadType = VariablePayload | ConstantPayload;

  export type MessageType = "FROM_TAB" | "FROM_POPUP";

  type MessagePayloadType = "constant" | "variable" | "signal";

  interface MessageBase {
    type: MessageType;
    payloadType: MessagePayloadType;
  }

  interface VariableMessage extends MessageBase {
    payload: VariablePayload;
    payloadType: "variable";
  }

  interface ConstantMessage extends MessageBase {
    payload: ConstantPayload;
    payloadType: "constant";
  }

  interface SignalMessage extends MessageBase {
    payload: "END";
    payloadType: "signal";
  }

  export type Message = VariableMessage | ConstantMessage | SignalMessage;
}
