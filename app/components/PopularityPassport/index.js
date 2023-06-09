import React from 'react';
import { Col, List, Row, Skeleton } from 'antd';
import PopularityList from '../PopularityList';
import { PopularityScatter } from '../PopularityScatter';

export default function PopularityPassport(props) {
  let listSize = 5;
  let tracks = Object.values(props.tracks);
  let artists = Object.values(props.artists);
  let mostPopularTracks = tracks
    .sort(function(a, b) {
      return b.popularity - a.popularity;
    })
    .slice(0, listSize);

  let leastPopularTracks = tracks
    .sort(function(a, b) {
      return a.popularity - b.popularity;
    })
    .slice(0, listSize);

  let mostPopularArtists = artists
    .sort(function(a, b) {
      return b.popularity - a.popularity;
    })
    .slice(0, listSize);

  let leastPopularArtists = artists
    .sort(function(a, b) {
      return a.popularity - b.popularity;
    })
    .slice(0, listSize);
  return (
    <div>
      <Row>
        <Col
          span={6}
          xs={{ order: 1 }}
          sm={{ order: 2 }}
          md={{ order: 3 }}
          lg={{ order: 4 }}
        >
          <PopularityList
            getImage={props.getTrackImage}
            key={1}
            data={mostPopularTracks}
            header="Your MAINSTREAM Tracks"
          />
        </Col>
        <Col
          span={6}
          xs={{ order: 1 }}
          sm={{ order: 2 }}
          md={{ order: 3 }}
          lg={{ order: 4 }}
        >
          <PopularityList
            getImage={props.getArtistImage}
            key={3}
            data={mostPopularArtists}
            header="Your MAINSTREAM Artists"
          />
        </Col>
        <Col
          span={6}
          xs={{ order: 1 }}
          sm={{ order: 2 }}
          md={{ order: 3 }}
          lg={{ order: 4 }}
        >
          <PopularityList
            getImage={props.getTrackImage}
            key={2}
            data={leastPopularTracks}
            header="Your SECRET Tracks"
          />{' '}
        </Col>

        <Col
          span={6}
          xs={{ order: 1 }}
          sm={{ order: 2 }}
          md={{ order: 3 }}
          lg={{ order: 4 }}
        >
          <PopularityList
            getImage={props.getArtistImage}
            key={4}
            data={leastPopularArtists}
            header="Your SECRET Artists"
          />
        </Col>
      </Row>
      {/* <PopularityScatter tracks={props.tracks} artists={props.artists} /> */}
    </div>
  );
}
