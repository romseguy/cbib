import { Heading } from "@radix-ui/themes";
import { useSelector } from "react-redux";
import { getState } from "~/store";
import { localize } from "~/utils";

export function Home(props) {
  const { loaderData } = props;
  const { isMobile, lib = loaderData.lib, locale } = useSelector(getState);
  return (
    <div
      id="home-page"
      css={isMobile ? { padding: "12px" } : { padding: "48px" }}
    >
      {/* {locale === "en" ? (
        <>
          In reality, acquiring self-consciousness means long and hard work. How
          can a man agree to this work if he thinks he already possesses the
          very thing which is promised him as the result of long and hard work?
          Naturally a man will not begin this work and will not consider it
          necessary until he becomes convinced that he possesses neither
          self-consciousness nor all that is connected with it, that is, unity
          or individuality, permanent 'I' and will. -- p.44{" "}
          <i>The psychology of Man's possible evolution</i> OUSPENSKY
        </>
      ) : (
        <>
          <p>
            En réalité, l'acquisition de la conscience de soi nécessite un
            travail dur et prolongé. Comment un Homme accepterait-il de se plier
            à ce travail s'il estime posséder déjà cette chose même qu'on lui
            promet comme résultat d'un travail long et difficile ?
            Naturellement, cet Homme n'entreprendra pas ce travail, ni même n'en
            éprouvera-t-il la nécessité, avant d'être convaincu qu'il ne possède
            ni la conscience de soi ni tout ce qui s'y rapporte, à savoir
            l'unité intérieure ou individualité, un Moi permanent et la volonté.
            -- p.44 <i>L'évolution possible de l'Homme</i> OUSPENSKY
          </p>
          <br />
          <p>
            La transformation psychologique de l’Homme veut dire la révision
            totale et dans tous les recoins de sa conscience des mécanismes qui
            dans le passé ont constitué sa conscience inférieure. La
            transformation psychologique de l’Homme veut dire la réorganisation
            de son mental, la réorganisation de son pouvoir énergétique, la
            réorganisation de sa volonté, la réorganisation de son intelligence.
            C’est ça la transformation psychologique de l’Homme nouveau. Ce
            n’est pas simplement l’appointement spirituel d’une vision
            philosophique pour le bien-être égoïque d’un désir spiritualisé,
            c’est le mouvement intégral de l’énergie à travers sa conscience
            pour le déblocage sur le plan humain d’une force créative qui
            permettra, éventuellement, selon le nombre et la puissance créative
            de cette énergie, l’évolution d’une nouvelle civilisation. --{" "}
            <i>Le contrôle de la vie</i> Bernard de Montréal
          </p>
        </>
      )} */}

      <Heading color="yellow">{localize("Bonjour !", "Hello!")}</Heading>
      <p>
        {localize(
          "Sélectionnez un livre dans la bibliothèque ci-dessus pour découvrir une sélection de citations.",
          "Select a book in the library above to access its quotes.",
        )}
      </p>

      {/*<ul>
        <li>
          <b>{localize("Auteur", "Author")} : </b>
          <Link href={lib.author_url || "#"} target="_blank">
            {lib?.author || localize("Anonyme", "Anonymous")}
          </Link>
        </li>
      </ul>*/}
    </div>
  );
}
