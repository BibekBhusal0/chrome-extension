import Sidebar from "@/components/sidebar";
import BookmarkTree from "@/components/bookmarks/tree";
import SelectSize from "@/components/bookmarks/size";
import Button from "@mui/material/Button";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "@/redux/store";
import { toggleShowFavorites } from "@/redux/slice/bookmark";
import BookmarkSearch from "@/components/bookmarks/search";
import { useBookmarkFolder } from "@/hooks/useBookmarks";
import BookmarkBreadcrumb from "@/components/bookmarks/breadcrumb";
import BookmarkGrid from "@/components/bookmarks/grid";
import { changeCurrentFolder } from "@/redux/slice/bookmark";
import { SelectChangeEvent } from "@mui/material/Select";
import { changeFolderSize } from "@/redux/slice/bookmark";
import {
  allFolderSizes,
  bookmarkTreeNodeArray,
  folderSizes,
} from "@/types/slice/bookmark";
import { ScrollArea } from "@/components/scrollarea";
import Favorites from "@/layout/widgets/favorites";
import { reorderBookmarks } from "@/utils/bookmark";

function BookmarkManager() {
  return (
    <Sidebar
      showButton
      resizableBoxProps={{
        children: (
          <ScrollArea className="h-full bg-primary-1">
            <FavButton />
            <BookmarkTree />
          </ScrollArea>
        ),
      }}
      headerProps={{ className: "h-20" }}
      header={
        <>
          <BookmarkSearch />
          <BookmarkSizeSelect />
        </>
      }
      containerProps={{ className: "size-full h-full" }}
      contentContainerProps={{ className: "h-full gap-0 pl-4" }}
      children={<MainBookmarks />}
    />
  );
}

function BookmarkSizeSelect() {
  const { folderSize } = useSelector((state: StateType) => state.bookmarks);
  const dispatch = useDispatch();

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const val = event.target.value as folderSizes;
    if (allFolderSizes.includes(val)) {
      dispatch(changeFolderSize(val));
    }
  };
  return <SelectSize value={folderSize} onChange={handleChange} />;
}

function FavButton() {
  const dispatch = useDispatch();
  const { showFavorites } = useSelector((state: StateType) => state.bookmarks);
  return (
    <div className="flex-center w-full">
      <Button
        sx={{ marginX: "auto", marginY: "1rem" }}
        className="transition-all"
        variant={showFavorites ? "outlined" : "contained"}
        onClick={() => dispatch(toggleShowFavorites())}>
        <div className="text-xl flex-center gap-2">
          <Icon icon="mdi:heart-outline" />
          <div>{showFavorites ? "Hide " : "Show "} All Favorites</div>
        </div>
      </Button>
    </div>
  );
}

function MainBookmarks() {
  const { currentFolderID, showFavorites, folderSize } = useSelector(
    (state: StateType) => state.bookmarks
  );
  const dispatch = useDispatch();
  const onFolderChange = (id: string) => dispatch(changeCurrentFolder(id));
  const props = { currentFolderID, onFolderChange };

  return (
    <>
      <div className="p-4">
        {showFavorites ? "Favorites" : <BookmarkBreadcrumb {...props} />}
      </div>
      {showFavorites ? (
        <Favorites {...props} id={1} iconSize={folderSize} />
      ) : (
        <ScrollArea>
          <BookmarksFolder />
        </ScrollArea>
      )}
    </>
  );
}

function BookmarksFolder() {
  const { currentFolderID } = useSelector(
    (state: StateType) => state.bookmarks
  );
  const bookmarks = useBookmarkFolder(currentFolderID);
  return <OnlyBookmarks bookmarks={bookmarks} />;
}

function OnlyBookmarks({ bookmarks }: bookmarkTreeNodeArray) {
  const { folderSize } = useSelector((state: StateType) => state.bookmarks);
  const dispatch = useDispatch();
  const onFolderChange = (id: string) => dispatch(changeCurrentFolder(id));
  const onReorder = reorderBookmarks;
  const props = { folderSize, bookmarks, onFolderChange, onReorder };

  return <BookmarkGrid {...props} />;
}

export default BookmarkManager;
