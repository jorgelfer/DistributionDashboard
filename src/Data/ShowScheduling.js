import Charts from "../Charts/Charts";
import Error from "../UI/Error/Error";
import { useQuery } from "@tanstack/react-query";
import { defineFetch } from "./defineFetch";
// import Sidebar from "../UI/Sidebar/Sidebar";
import Collapsible from "../UI/Collapsible/Collapsible";

export default function ShowScheduling({
  networkModel,
  inFile1,
  openDSSData,
  activeLayer,
}) {
  // energy scheduling data
  openDSSData["kVA_base"] = 100.0;
  openDSSData["formulation"] = "fbs";
  const { qkey, fetchFn } = defineFetch(activeLayer, networkModel, inFile1);
  let { data, isPending, isError, error } = useQuery({
    queryKey: qkey,
    queryFn: () => fetchFn(openDSSData),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  let content;
  if (isPending) {
    content = <div className="loading">Loading...</div>;
  }

  if (isError) {
    content = (
      <Error
        title="An error occurred during OpenDSS QSTS fetching!"
        message={error.info?.message || "Failed to fetch the data"}
      />
    );
  }

  if (data) {
    content = (
      <>
        <Charts
          data={data}
          nodeSize={networkModel.includes("8500Node") ? 3 : 5}
          vm_base={networkModel.includes("8500Node") ? 0.05 : 0.05}
        />
        <Collapsible
          open={false}
          title="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
        >
          Consectetur adipiscing elit pellentesque habitant morbi tristique.
          Pulvinar pellentesque habitant morbi tristique. Vel quam elementum
          pulvinar etiam. Pulvinar pellentesque habitant morbi tristique
          senectus et netus et. Elementum integer enim neque volutpat. Faucibus
          in ornare quam viverra orci sagittis. Amet volutpat consequat mauris
          nunc congue nisi vitae suscipit. Dui accumsan sit amet nulla. Proin
          sagittis nisl rhoncus mattis. Enim nulla aliquet porttitor lacus. Arcu
          odio ut sem nulla pharetra diam sit amet. Gravida rutrum quisque non
          tellus orci ac auctor augue
        </Collapsible>
      </>
    );
  }

  return content;
}
