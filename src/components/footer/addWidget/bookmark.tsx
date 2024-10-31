import { useDispatch } from "react-redux";
import useBookmarksUpdate, { useAllBookmarks } from "@/hooks/useBookmarks";
import { ReactNode, useState } from "react";
import useCurrentLayout from "@/hooks/useCurrentLayout";
import { widgetDimensions } from "@/utils/getWidget";
import useAvailablePosition from "@/hooks/useAvailablePosition";
import { currentSpaceAddWidget } from "@/redux/slice/layout";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";

function AddBookmark() {
  const layout = useCurrentLayout();
  const dimensions = widgetDimensions["bookmark"];
  const { minH, minW } = dimensions;
  const availablePosition = useAvailablePosition(minW, minH);
  const { bookmarks } = useAllBookmarks();

  const dispatch = useDispatch();
  const addItem = (id: string) => {
    if (availablePosition) {
      dispatch(
        currentSpaceAddWidget({
          type: "bookmark",
          values: { id: 0, iconSize: "small", folderId: id },
          gridProps: { ...dimensions, ...availablePosition },
        })
      );
    }
  };
  if (!layout) return null;
  const { widgets } = layout;
  const presentBookmark = widgets.filter(({ type }) => type === "bookmark");
  const presentBookmarkId = presentBookmark.map(
    ({ values: { id } }) => `${id}`
  );

  const getBookmarkFolders = (
    bookmark:
      | chrome.bookmarks.BookmarkTreeNode[]
      | chrome.bookmarks.BookmarkTreeNode
  ): ReactNode => {
    if (Array.isArray(bookmark)) {
      return (
        <List sx={{ pl: "3px" }}>
          {bookmarks.map((child) => getBookmarkFolders(child))}
        </List>
      );
    }
    if (bookmark.children) {
      return (
        <>
          {bookmark.title && bookmark.title.trim() !== "" && (
            <ListItemButton
              className="text-xl"
              disabled={presentBookmarkId.includes(bookmark.id)}
              onClick={() => addItem(bookmark.id)}>
              {bookmark.title}
            </ListItemButton>
          )}
          {bookmark.children.map((child) => getBookmarkFolders(child))}
        </>
      );
    }
    return null;
  };
  return <>{getBookmarkFolders(bookmarks)}</>;
}

export default AddBookmark;