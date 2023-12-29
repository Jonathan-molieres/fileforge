const cookies = new UniversalCookie();
const { Box, FormControlLabel, Switch, Divider } = MaterialUI;
const { ReactDiagram } = goJsReact;
const menuWidth = 240;

function GraphModels({}) {
  // Using
  const [showAttributes, setShowAttributes] = React.useState(
    cookies.get("DebugBar.graphModels.showAttributes") || "true" === "true"
  );
  const [showNullAttributes, setShowNullAttributes] = React.useState(
    cookies.get("DebugBar.graphModels.showNullAttributes") || "true" === "true"
  );
  const [showAttributeTypes, setShowAttributeTypes] = React.useState(
    cookies.get("dev.graphModels.showAttributesTypes") || "false" === "true"
  );
  const [showRelevant, setShowRelevant] = React.useState(
    cookies.get("dev.graphModels.showRelevant") || "true" === "true"
  );
  const [includeApps, setIncludeApps] = React.useState(
    (cookies.get("dev.graphModels.includeApps") || "").split(",")
  );
  const [graph, setGraph] = React.useState({});
  const { nodes = [], links = [], apps = [] } = graph;

  // Acting
  const handleChangeShowAttributes = (e) => {
    setShowAttributes(e.target.checked);
    cookies.set("dev.graphModels.showAttributes", e.target.checked);
  };
  const handleChangeShowAttributeTypes = (e) => {
    setShowAttributeTypes(e.target.checked);
    cookies.set("dev.graphModels.showAttributeTypes", e.target.checked);
  };
  const handleChangeShowNullAttributes = (e) => {
    setShowNullAttributes(e.target.checked);
    cookies.set("dev.graphModels.showNullAttributes", e.target.checked);
  };
  const handleChangeShowRelevant = (e) => {
    setShowRelevant(e.target.checked);
    cookies.set("dev.graphModels.showRelevant", e.target.checked);
  };
  const handleChangeShowApp = (app) => (e) => {
    let newApps;
    if (e.target.checked) {
      newApps = [...includeApps, app].filter((a) => apps.includes(app) !== -1);
    } else {
      newApps = includeApps.filter(
        (a) => a != app && apps.includes(app) !== -1
      );
    }
    setIncludeApps(newApps);
    cookies.set("dev.graphModels.includeApps", newApps.join(","));
  };

  const fetchGraph = () => {
    fetch(window.location.href, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        format: "json",
      },
      body: JSON.stringify({
        showAttributes,
        showNullAttributes,
        showAttributeTypes,
        showRelevant,
        includeApps,
      }),
    })
      .then((response) => response.json())
      .then((data) => setGraph(data));
  };

  React.useEffect(() => {
    fetchGraph();
  }, [
    showAttributes,
    showNullAttributes,
    showAttributeTypes,
    includeApps,
    showRelevant,
  ]);

  // Rendering
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        display: "grid",
        gridTemplateColumns: "200px 1fr",
      }}
    >
      <Box
        sx={{
          p: 2,
          boxShadow: "0 0 3px 0 rgba(0,0,0,0.5)",
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={showAttributes}
              onChange={handleChangeShowAttributes}
            />
          }
          label="Attributes"
        />
        <FormControlLabel
          disabled={!showAttributes}
          control={
            <Switch
              checked={showNullAttributes}
              onChange={handleChangeShowNullAttributes}
            />
          }
          label="Nullables"
        />
        <FormControlLabel
          disabled={!showAttributes}
          control={
            <Switch
              checked={showAttributeTypes}
              onChange={handleChangeShowAttributeTypes}
            />
          }
          label="Types"
        />
        <FormControlLabel
          disabled={!showAttributes}
          control={
            <Switch
              checked={showRelevant}
              onChange={handleChangeShowRelevant}
            />
          }
          label="Relevant only"
        />
        <Divider sx={{ mt: 2 }} />

        {apps.map((app) => (
          <FormControlLabel
            key={app}
            control={
              <Switch
                checked={includeApps.includes(app)}
                onChange={handleChangeShowApp(app)}
              />
            }
            label={app}
          />
        ))}
      </Box>
      <Box
        sx={{
          "& .diagram": {
            width: "100%",
            height: "100%",
          },
        }}
      >
        <ReactDiagram
          initDiagram={GraphModelsInitDiagram}
          divClassName="diagram"
          nodeDataArray={nodes}
          linkDataArray={links}
        />
      </Box>
    </Box>
  );
}

function GraphModelsInitDiagram() {
  const $ = go.GraphObject.make;
  const d = $(go.Diagram, {
    "animationManager.isEnabled": false,
    "undoManager.isEnabled": true,
    allowDelete: false,
    allowCopy: false,
    "clickCreatingTool.archetypeNodeData": {
      text: "new node",
      color: "lightblue",
    },
    layout: $(go.ForceDirectedLayout),
    model: new go.GraphLinksModel({
      linkKeyProperty: "key",
    }),
  });

  d.nodeTemplate = $(
    go.Node,
    "Auto",
    {
      selectionAdorned: true,
      resizable: true,
      layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
      fromSpot: go.Spot.AllSides,
      toSpot: go.Spot.AllSides,
      isShadowed: true,
      shadowOffset: new go.Point(3, 3),
      shadowColor: "#C5C1AA",
    },
    new go.Binding("location", "location").makeTwoWay(),
    new go.Binding(
      "desiredSize",
      "visible",
      (v) => new go.Size(NaN, NaN)
    ).ofObject("LIST"),
    $(go.Shape, "RoundedRectangle", {
      fill: "white",
      stroke: "#eeeeee",
      strokeWidth: 3,
    }),
    $(
      go.Panel,
      "Table",
      { margin: 8, stretch: go.GraphObject.Fill },
      $(go.RowColumnDefinition, {
        row: 0,
        sizing: go.RowColumnDefinition.None,
      }),
      // the table header
      $(
        go.TextBlock,
        {
          row: 0,
          alignment: go.Spot.TopRight,
          margin: new go.Margin(0, 0, 4, 2),
          font: "16px sans-serif",
        },
        new go.Binding("text", "app"),
        {
          row: 0,
          alignment: go.Spot.TopRight,
          margin: new go.Margin(0, 0, 4, 2),
          font: "16px sans-serif",
        },
        new go.Binding("text", "key")
      ),
      $(
        go.Panel,
        "Vertical",
        {
          name: "LIST",
          row: 1,
          padding: 3,
          alignment: go.Spot.TopLeft,
          defaultAlignment: go.Spot.Left,
          stretch: go.GraphObject.Horizontal,
          itemTemplate: $(
            go.Panel,
            "Horizontal",
            $(
              go.Shape,
              {
                desiredSize: new go.Size(15, 15),
                strokeJoin: "round",
                strokeWidth: 3,
                stroke: null,
                margin: 2,
              },
              new go.Binding("figure", "figure"),
              new go.Binding("fill", "color"),
              new go.Binding("stroke", "color")
            ),
            $(
              go.TextBlock,
              {
                stroke: "#333333",
                font: "14px sans-serif",
              },
              new go.Binding("text", "name")
            ),
            $(
              go.TextBlock,
              {
                margin: new go.Margin(0, 5),
                column: 2,
                font: "12px sans-serif",
                stroke: "grey",
                alignment: go.Spot.Left,
              },
              new go.Binding("text", "info")
            )
          ),
        },
        new go.Binding("itemArray", "items")
      )
    )
  );

  d.linkTemplate = $(
    go.Link,
    {
      selectionAdorned: true,
      layerName: "Foreground",
      reshapable: true,
      routing: go.Link.AvoidsNodes,
      corner: 5,
      curve: go.Link.JumpOver,
    },
    $(go.Shape, { stroke: "#303B45", strokeWidth: 2.5 }),
    $(
      go.TextBlock,
      {
        textAlign: "center",
        font: "bold 14px sans-serif",
        stroke: "#1967B3",
        segmentIndex: 0,
        segmentOffset: new go.Point(NaN, NaN),
        segmentOrientation: go.Link.OrientUpright,
      },
      new go.Binding("text", "text")
    ),
    $(
      go.TextBlock,
      {
        textAlign: "center",
        font: "bold 14px sans-serif",
        stroke: "#1967B3",
        segmentIndex: -1,
        segmentOffset: new go.Point(NaN, NaN),
        segmentOrientation: go.Link.OrientUpright,
      },
      new go.Binding("text", "toText")
    )
  );
  return d;
}
