import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button, Heading } from "@radix-ui/themes";
import { localize } from "~/utils";
import { BooksIcon, Flex } from "./shared";

export const LibTitle = (props) => {
  const { lib } = props;
  return (
    <>
      <Flex>
        <BooksIcon height="3em" width="3em" fill="currentColor" />

        <Heading>
          <i>{lib[localize("name")] || lib.name}</i>
        </Heading>
      </Flex>

      <Button
        ml="1"
        variant="surface"
        onClick={() =>
          alert(
            localize(
              "Pour ajouter un livre, envoyez un e-mail à " +
                import.meta.env.VITE_PUBLIC_EMAIL +
                "",
              "To add a book, send an email to " +
                import.meta.env.VITE_PUBLIC_EMAIL +
                "",
            ),
          )
        }
      >
        <PlusCircledIcon />
        {localize("Ajouter un livre", "Add a book")}
      </Button>
    </>
  );
};
