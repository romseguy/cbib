import { Badge, Box } from "@radix-ui/themes";
import { useState } from "react";
import { useSelector } from "react-redux";
import { DeleteIcon, Flex, UserIcon, useToast } from "~/components";
import { getState } from "~/store";
import {
  toUsername,
  fullDateString,
  toCss,
  timeAgo,
  localize,
  user_badge_click,
} from "~/utils";

export const Comment = (props) => {
  const { comment, ...p } = props;
  const { auth, locale } = useSelector(getState);
  const user = auth?.user;
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToast();

  async function onDeleteClick(comment) {
    try {
      alert(
        localize(
          "Cette fonctionnalité n'est pas encore disponible",
          "This function is not yet available",
        ),
      );
      // setIsCommentLoading({
      //   ...isCommentLoading,
      //   [comment.id]: true,
      // });
      // const { error } = await dispatch(
      //   deleteComment.initiate({
      //     url: "/comment?id=" + comment.id,
      //   }),
      // );

      // if (data.error) {
      //   setIsCommentLoading({
      //     ...isCommentLoading,
      //     [comment.id]: false,
      //   });

      //   if (process.env.NODE_ENV === "development") {
      //   } else {
      //     showToast(data.message);
      //     return;
      //   }
      // }

      // dispatch(
      //   setState({
      //     book: {
      //       ...book,
      //       notes: (book.notes || []).map((n) => {
      //         if (n.id === note.id) {
      //           return {
      //             ...n,
      //             comments: (n.comments || []).filter(
      //               (c) => c.id !== comment.id,
      //             ),
      //           };
      //         }
      //         return n;
      //       }),
      //     },
      //   }),
      // );
    } catch (error) {
      showToast(error, true);
      // setIsCommentLoading({
      //   ...isCommentLoading,
      //   [comment.id]: false,
      // });
    }
  }

  return (
    <Flex key={"comment-" + comment.id} justify="between" p="3" {...p}>
      {/* comment */}
      <Box>
        <Badge
          size="3"
          mr="3"
          variant="surface"
          onClick={() => alert(user_badge_click)}
        >
          <UserIcon />
          {toUsername(comment.comment_email)}
        </Badge>
        {comment.html}
      </Box>

      <Flex
        gap="1"
        style={{
          cursor: "pointer",
        }}
      >
        {/* date */}
        <div css={toCss({ whiteSpace: "nowrap" })}>
          <Badge title={fullDateString(comment.created_at, locale)}>
            {timeAgo({ date: comment.created_at })}
          </Badge>
        </div>

        {/* delete */}
        {(process.env.NODE_ENV === "development" ||
          comment.comment_email === user?.email) && (
          <DeleteIcon
            onClick={async () => {
              if (isLoading) return;
              const ok = confirm(
                localize(
                  "Êtes-vous sûr de vouloir supprimer ce commentaire ?",
                  "Do you really want to delete this comment?",
                ),
              );
              if (!ok) return;
              setIsLoading(true);
              await onDeleteClick(comment);
              setIsLoading(false);
            }}
          />
        )}
      </Flex>
    </Flex>
  );
};
