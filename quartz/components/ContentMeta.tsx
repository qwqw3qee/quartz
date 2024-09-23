import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates && fileData.slug !== "index") {
        if (fileData.dates.created) {
          segments.push(
            <span>
              ✍ 创建于 {formatDate(fileData.dates.created,cfg.locale)}
            </span>,
          )
        }

        if (fileData.dates.modified) {
          segments.push(
            <span>
              🖋️ 更新于 {formatDate(fileData.dates.modified,cfg.locale)}
            </span>,
          )
        }
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(
          <span>
            ⏱︎ {displayedTime}
          </span>)
      }

      segments.push(
        <a
          href={`https://github.githistory.xyz/qwqw3qee/quartz/commits/v4/${fileData.filePath}`}
          target="_blank"
        >
          ⏳ 修改记录
        </a>,
      )
      const segmentsElements = segments.map((segment) => <span>{segment}</span>)

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segmentsElements}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
