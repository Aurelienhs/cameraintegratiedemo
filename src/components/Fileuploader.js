import styles from "./style.module.css";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Webcam from "@uppy/webcam";
import RemoteSources from "@uppy/remote-sources";

// Don't forget the CSS: core and the UI components + plugins you are using.
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/webcam/dist/style.min.css";
const uppy = new Uppy({
  debug: true,
  autoProceed: false,
})
  /*.use(RemoteSources, {
    companionUrl: "https://your-companion-url",
  })*/
  .use(Webcam);

const Fileuploader = () => {
  return (
    <div id="dashboard">
      <Dashboard
        className={styles.dashboard}
        uppy={uppy}
        plugins={["RemoteSources", "Webcam"]}
      />
    </div>
  );
};
export default Fileuploader;
