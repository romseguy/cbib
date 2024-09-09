import { marked } from "marked";
import { useRouter } from "next/router";
import { AppHeading } from "features/common";
import { Layout } from "features/layout";
import { useSession } from "hooks/useSession";
import { PageProps } from "pages/_app";
import BooksMd from "content/Books/Books.md";
import { VStack } from "@chakra-ui/react";
import { TopicsList } from "features/forum/TopicsList";

const BooksPage = (props: PageProps) => {
  const BooksHtml = marked.parse(BooksMd);
  const router = useRouter();
  const { data: session } = useSession();
  console.log("🚀 ~ IndexPage ~ session:", session);

  const topics = [
    {
      topicName: "An interesting addition to this topic",
      topicMessages: [],
      //createdAt: "2024-10-28T14:29:17.596Z",
      createdBy: { userName: "romseguy" }
    },
    {
      topicName: "Let's talk about one of these books",
      topicMessages: [],
      createdBy: { userName: "romseguy" }
    }
  ];
  const query = { data: { orgUrl: "test" } };
  const subQuery = {};

  //#region local state
  // const [isDisabled, setIsDisabled] = useState(getEnv() === "production");
  // const [isLoading, setIsLoading] = useState(false);
  //#endregion

  //#region form
  // const {
  //   register,
  //   control,
  //   errors,
  //   clearErrors,
  //   handleSubmit,
  //   setError,
  //   setValue,
  //   formState
  // } = useFormPersist<{
  //   formErrorMessage: string;
  //   email: string;
  //   message: string;
  // }>(
  //   useForm<{ formErrorMessage: string; email: string; message: string }>({
  //     defaultValues: { message: "" }
  //   })
  // );

  // useLeaveConfirm({ formState });

  // const onClose = () => {
  //   clearErrors("formErrorMessage");
  //   //props.onClose && props.onClose();
  // };

  // const onChange = () => {
  //   clearErrors("formErrorMessage");
  // };

  // const onSubmit = async (form: { email: string; message: string }) => {
  //   console.log("submitted", form);
  //   const { email } = form;
  //   setIsLoading(true);

  //   try {
  //     await api.post("admin/contact", { email, message: form.message });
  //     setIsLoading(false);
  //     router.push("/sent", "/sent", { shallow: true });
  //     onClose();
  //   } catch (error) {
  //     setIsLoading(false);
  //     handleError(error, (message, field) => {
  //       setError(field || "formErrorMessage", {
  //         type: "manual",
  //         message
  //       });
  //     });
  //   }
  // };
  //#endregion

  return (
    <Layout pageTitle="Books" {...props}>
      <AppHeading>Books</AppHeading>

      <VStack bgColor="rgba(1,1,1,0.1)" mb={3}>
        <AppHeading smaller>Markdown file</AppHeading>
        <div
          dangerouslySetInnerHTML={{
            __html: BooksHtml
          }}
        />
      </VStack>
      <VStack bgColor="rgba(1,1,1,0.1)" pb={3}>
        <AppHeading smaller>Threads</AppHeading>
        <TopicsList
          topics={topics}
          query={query}
          subQuery={subQuery}
          isCreator
          width="80%"
          m="0 auto"
        />
      </VStack>

      {/* <FormControl isInvalid={!!errors["message"]} isRequired mb={3}>
        <FormLabel>Votre message</FormLabel>
        <Controller
          name="message"
          control={control}
          rules={{ required: "Veuillez saisir un message" }}
          render={(renderProps) => {
            return (
              <RTEditor
                placeholder="Écrire le message"
                onChange={({ html }) => {
                  renderProps.onChange(html);
                }}
              />
            );
          }}
        />
      </FormControl> */}
    </Layout>
  );
};

export default BooksPage;
