import { Layout } from "features/layout";
import { useSession } from "hooks/useSession";
import { PageProps } from "./_app";

const IndexPage = (props: PageProps) => {
  const { data: session } = useSession();
  console.log("🚀 ~ IndexPage ~ session:", session);

  return (
    <Layout pageTitle="index" {...props}>
      Welcome
    </Layout>
  );
};

export default IndexPage;
