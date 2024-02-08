import InputGroup from "react-bootstrap/InputGroup";
import { InfoProps } from "./Info";
import { Info } from "./Info";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons/faCircleQuestion";

export const HelpInputGroup = ({
  helptext,
}: {
  helptext?: InfoProps["infobody"];
}) => {
  return (
    <InputGroup.Text>
      <Info infobody={helptext}>
        <FontAwesomeIcon icon={faCircleQuestion} />
      </Info>
    </InputGroup.Text>
  );
};
