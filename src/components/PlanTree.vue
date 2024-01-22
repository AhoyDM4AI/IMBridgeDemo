<template>
  <div style="text-align: center; background: rgb(240, 242, 244)">
    <svg :id="content" width="100%" height="100%"></svg>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import "../assets/libd3/jquery-1.9.1.min";
import "../assets/libd3/tipsy"
import * as d3 from "d3";
import dagreD3 from "dagre-d3";

import "/src/assets/libd3/tipsy.css"

const props = defineProps({
  content: String,
  isOpt: Boolean,
});

const sp = "PREDICT OP";

onMounted(() => {
  //Draw();
});
let d = {
  nodes: [
    { id: 6, label: "RESULT", mark: 0, float: "result set." },
    { id: 5, label: "PREDICT OP", mark: 0, float: "predict function: predict" },
    {
      id: 0,
      label: "HASH JOIN",
      mark: 1,
      shape: "rect",
      float:
        "output([l.prop_id], [l.price_usd], [h.count_bookings], [h.count_clicks])",
    },
    {
      id: 1,
      label: "HASH JOIN",
      mark: 1,
      shape: "rect",
      float:
        "output([l.prop_id], [l.price_usd], [h.count_bookings], [h.count_clicks], [l.srch_id], [l.prop_location_score1], [l.prop_location_score2],[l.prop_log_historical_price], [l.orig_destination_distance], [l.position], [h.prop_review_score], [h.avg_bookings_usd], [h.stdev_bookings_usd], [h.prop_country_id],[h.prop_starrating], [h.prop_brand_bool])",
    },
    {
      id: 2,
      label: "TABLE SCAN",
      mark: 1,
      shape: "rect",
      float:
        "output([l.prop_id], [l.srch_id], [l.prop_location_score1], [l.prop_location_score2], [l.prop_log_historical_price], [l.price_usd], [l.orig_destination_distance],[l.position])",
    },
    {
      id: 3,
      label: "TABLE SCAN",
      mark: 1,
      shape: "rect",
      float:
        "output([h.prop_id], [h.prop_review_score], [h.avg_bookings_usd], [h.stdev_bookings_usd], [h.prop_country_id], [h.prop_starrating], [h.prop_brand_bool],[h.count_clicks], [h.count_bookings])",
    },
    {
      id: 4,
      label: "TABLE SCAN",
      mark: 1,
      shape: "rect",
      float:
        "output([s.srch_id], [s.year], [s.month], [s.weekofyear], [s.time], [s.site_id], [s.visitor_location_country_id], [s.srch_destination_id],[s.srch_length_of_stay], [s.srch_booking_window], [s.srch_adults_count], [s.srch_children_count], [s.srch_room_count], [s.srch_saturday_night_bool], [s.random_bool])",
    },
  ],
  edges: [
    { source: 3, target: 1, label: "" },
    { source: 2, target: 1, label: "" },

    { source: 4, target: 0, label: "" },
    { source: 1, target: 0, label: "" },

    { source: 0, target: 5, label: "" },
    { source: 5, target: 6, label: "" },
  ],
};

let d2 = {
  nodes: [
    { id: 5, label: "RESULT", mark: 0, float: "result set." },
    {
      id: 0,
      label: "HASH JOIN",
      mark: 1,
      shape: "rect",
      float:
        "output([l.prop_id], [l.price_usd], [h.count_bookings], [h.count_clicks])",
    },
    {
      id: 1,
      label: "HASH JOIN",
      mark: 1,
      shape: "rect",
      float:
        "output([l.prop_id], [l.price_usd], [h.count_bookings], [h.count_clicks], [l.srch_id], [l.prop_location_score1], [l.prop_location_score2],[l.prop_log_historical_price], [l.orig_destination_distance], [l.position], [h.prop_review_score], [h.avg_bookings_usd], [h.stdev_bookings_usd], [h.prop_country_id],[h.prop_starrating], [h.prop_brand_bool])",
    },
    {
      id: 2,
      label: "TABLE SCAN",
      mark: 1,
      shape: "rect",
      float:
        "output([l.prop_id], [l.srch_id], [l.prop_location_score1], [l.prop_location_score2], [l.prop_log_historical_price], [l.price_usd], [l.orig_destination_distance],[l.position])",
    },
    {
      id: 3,
      label: "TABLE SCAN",
      mark: 1,
      shape: "rect",
      float:
        "output([h.prop_id], [h.prop_review_score], [h.avg_bookings_usd], [h.stdev_bookings_usd], [h.prop_country_id], [h.prop_starrating], [h.prop_brand_bool],[h.count_clicks], [h.count_bookings])",
    },
    {
      id: 4,
      label: "TABLE SCAN",
      mark: 1,
      shape: "rect",
      float:
        "output([s.srch_id], [s.year], [s.month], [s.weekofyear], [s.time], [s.site_id], [s.visitor_location_country_id], [s.srch_destination_id],[s.srch_length_of_stay], [s.srch_booking_window], [s.srch_adults_count], [s.srch_children_count], [s.srch_room_count], [s.srch_saturday_night_bool], [s.random_bool])",
    },
  ],
  edges: [
    { source: 3, target: 1, label: "" },
    { source: 2, target: 1, label: "" },

    { source: 4, target: 0, label: "" },
    { source: 1, target: 0, label: "" },

    { source: 0, target: 5, label: "" },
  ],
};

const extractDataset = (plan_data) => {
  if (props.isOpt) {
    return d;
  } else {
    return d2;
  }
};

const Draw = (plan_data) => {
  let dataset = extractDataset(plan_data);
  let g = new dagreD3.graphlib.Graph();
  g.setGraph({
    rankdir: "BT", // 设置节点的延伸排列方向，从上到下 TB从上到下
    // align: 'UL',  // 设置相同rank中node节点的对齐方式 DL下左

    // nodesep: 20,  // 相同层级rank中node的间距
    // edgesep: 30,  //edge之间的间距

    ranksep: 70, // 相邻层级之间的间距

    marginx: 5, //图整体与画布的左右间距
    marginy: 5, //图整体与画布的上下间距
  });
  dataset.nodes.forEach((item) => {
    if (item.label == sp) {
      g.setNode(item.id, {
        //节点标签
        label: item.label,
        //节点形状
        shape: item.shape,
        float: item.float,
        mark: item.mark,

        style: "fill:#bfd4f3; stroke:#000", //节点样式,可设置节点的颜色填充、节点边框
        labelStyle:
          "fill: #000; font-weight: 550; font-family: sans-serif; font-size: 20px", //节点标签样式, 可设置节点标签的文本样式（颜色、粗细、大小）
        rx: 12, // 设置圆角
        ry: 12, // 设置圆角
        paddingBottom: 20,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20,
        //节点样式
        // style: "textAlign: 'center';fill:#fff; stroke:#000; margin: 20px"

        // "width: 80px; height: 40px; line-height: 40px; font-size: 16px; text-align: center; border: 1px solid black; border-radius: 20px"
      });
    } else {
      g.setNode(item.id, {
        //节点标签
        label: item.label,
        //节点形状
        shape: item.shape,
        float: item.float,
        mark: item.mark,

        style: "fill:#fff; stroke:#000", //节点样式,可设置节点的颜色填充、节点边框
        labelStyle:
          "fill: #000; font-weight: 550; font-family: sans-serif; font-size: 20px", //节点标签样式, 可设置节点标签的文本样式（颜色、粗细、大小）
        rx: 12, // 设置圆角
        ry: 12, // 设置圆角
        paddingBottom: 20,
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20,
        //节点样式
        // style: "textAlign: 'center';fill:#fff; stroke:#000; margin: 20px"

        // "width: 80px; height: 40px; line-height: 40px; font-size: 16px; text-align: center; border: 1px solid black; border-radius: 20px"
      });
    }
  });
  dataset.edges.forEach((item) => {
    g.setEdge(item.source, item.target, {
      //边标签
      label: item.label,
      //边样式
      // style: "fill:#fff;stroke:#333;stroke-width:1.5px; stroke-width="4""
      style: "stroke: #8f7b7b; fill: none; ", // 连线样式
      arrowheadStyle: "fill: #fff;stroke: #8f7b7b;", //箭头样式，可以设置箭头颜色
      arrowhead: "vee", //箭头形状，可以设置 normal,vee,undirected 三种样式，默认为 normal
      curve: d3.curveBasis,
    });
  });

  // Create the renderer
  let render = new dagreD3.render();
  let history = d3.select("#" + props.content + "> g");
  if (history) {
    history.remove();
  }
  let content = d3.select("#" + props.content),
    svgGroup = content.append("g");

  // Set up zoom support

  let zoom = d3.zoom().on("zoom", function (fig, a, b, c) {
    svgGroup.attr("transform", fig.transform);
  });
  //content.call(zoom);

  // Simple function to style the tooltip for the given node.
  let styleTooltip = function (name, description) {
    return (
      "<p class='name'>" +
      name +
      "</p><p class='description'>" +
      description +
      "</p>"
    );
  };

  // Run the renderer. This is what draws the final graph.
  render(svgGroup, g);

  svgGroup
    .selectAll("g.node")
    .attr("title", function (v) {
      return styleTooltip(g.node(v).label, g.node(v).float);
    })
    .each(function (v) {
      console.log($(this).tipsy)
      $(this).tipsy({ gravity: "w", opacity: 1, html: true });
    });

  // Center the graph
  let initialScale = 0.7;
  content.call(
    zoom.transform,
    d3.zoomIdentity
      .translate((g.graph().width * initialScale) / 3, 20)
      .scale(initialScale)
  );

  content.attr("height", g.graph().height * initialScale + 20);
};

defineExpose({
  Draw,
});
</script>

<style scoped>
/* This styles the title of the tooltip */
.tipsy .name {
  font-size: 1.5em;
  font-weight: bold;
  color: #000;
  margin: 0;
}

/* This styles the body of the tooltip */
.tipsy .description {
  font-size: 1.2em;
}
</style>
