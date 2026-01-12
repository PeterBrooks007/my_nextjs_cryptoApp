import React, { memo } from "react";
import styles from "./CardComponent.module.css";
import useWindowSize from "@/hooks/useWindowSize";

type Props = {
  card?: string;
  color?: string;
};

const CardComponent = ({ card, color }: Props) => {
  const size = useWindowSize();

  const width = size.width && size.width < 600 ? "85%" : "85%";

  return (
    <div
      className={styles.card}
      style={{
        backgroundColor: color,
        borderRadius: "20px",
        width,
        height: "13.2em",
      }}
    >
      <div className={styles.card__info}>
        <div
          className={styles.card__logo}
          style={{ color: "white", fontSize: "16px" }}
        >
          {card}
        </div>

        <div className={styles.card__chip}>
          <svg
            className={styles.card__chipLines}
            role="img"
            width="20"
            height="20"
            viewBox="0 0 100 100"
            aria-label="Chip"
          >
            <g opacity="0.8">
              <polyline
                points="0,50 35,50"
                fill="none"
                stroke="#000"
                strokeWidth="2"
              />
              <polyline
                points="0,20 20,20 35,35"
                fill="none"
                stroke="#000"
                strokeWidth="2"
              />
              <polyline
                points="50,0 50,35"
                fill="none"
                stroke="#000"
                strokeWidth="2"
              />
              <polyline
                points="65,35 80,20 100,20"
                fill="none"
                stroke="#000"
                strokeWidth="2"
              />
              <polyline
                points="100,50 65,50"
                fill="none"
                stroke="#000"
                strokeWidth="2"
              />
              <polyline
                points="35,35 65,35 65,65 35,65 35,35"
                fill="none"
                stroke="#000"
                strokeWidth="2"
              />
              <polyline
                points="0,80 20,80 35,65"
                fill="none"
                stroke="#000"
                strokeWidth="2"
              />
              <polyline
                points="50,100 50,65"
                fill="none"
                stroke="#000"
                strokeWidth="2"
              />
              <polyline
                points="65,65 80,80 100,80"
                fill="none"
                stroke="#000"
                strokeWidth="2"
              />
            </g>
          </svg>
          <div className={styles.card__chipTexture}></div>
        </div>

        <div className={styles.card__type}>debit</div>

        <div className={styles.card__number} style={{ fontSize: "1.5rem" }}>
          <span className={styles.card__digitGroup}>0123</span>
          <span className={styles.card__digitGroup}>4567</span>
          <span className={styles.card__digitGroup}>8901</span>
          <span className={styles.card__digitGroup}>2345</span>
        </div>

        <div className={styles.card__validThru} aria-label="Valid thru">
          Valid
          <br />
          thru
        </div>

        <div className={styles.card__expDate}>
          <time dateTime="2038-01">01/38</time>
        </div>

        <div className={styles.card__name} aria-label="Jk Huger">
          Jk Huger
        </div>

        <div
          className={styles.card__vendor}
          role="img"
          aria-labelledby="card-vendor"
        >
          <span id="card-vendor" className={styles.card__vendorSr}>
            Mastercard
          </span>
        </div>

        <div className={styles.card__texture}></div>
      </div>
    </div>
  );
};

export default memo(CardComponent);
