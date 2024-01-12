import InputGroup from "react-bootstrap/InputGroup";
import { Info, InfoProps } from "./Info";

export const RequiredInputGroup = ({
  why,
}: {
  why?: InfoProps["infobody"];
}) => {
  return (
    <InputGroup.Text style={{ fontSize: 24 }}>
      <Info infobody={why || "Required"}>
        <span>*</span>
      </Info>
    </InputGroup.Text>
  );
};
