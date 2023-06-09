import {
  Avatar,
  Button,
  Card,
  Carousel,
  Col,
  Empty,
  Form,
  Image,
  Input,
  Layout,
  List,
  Menu,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Slider,
  Space,
  Tabs,
  Typography,
} from 'antd';
import React from 'react';
import { useEffect, useState } from 'react';
import {
  addItemsToPlaylist,
  createPlaylist,
  getGenreSeeds,
  getRecommendations,
  getUser,
  getUserProfile,
  searchArtistsRequest,
  userTopItemsRequest,
} from '../../utils/api/spotifyApi';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { LoginOutlined } from '@ant-design/icons';
import { render } from 'react-testing-library';
import TopItemsList from '../../components/TopItemsList';
import { PieChartComponent } from '../../components/PieChartComponent';
import { capitalizeFirstLetters, toCamelCase } from '../../utils/transformers';
import SpotifyLogoBlack from '../../images/spotify-logo.png';
import SpotifyLogoGreen from '../../images/spotify-logo-green.png';
import LoginModal from '../../components/LoginModal';
import SpotifyHeader from '../../components/SpotifyHeader';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import RecommendationForm from '../../components/RecommendationForm';
import { Helmet } from 'react-helmet';

const contentStyle = {
  height: '100vh',
  //   width: '100vh',
  color: '#fff',
  // lineHeight: '480px',
  textAlign: 'center',
  // background: '#1DB954',
  background: '#FFFFFF',
  // background: '#2c343c',
};

function PlaylistPage(props) {
  const CLIENT_ID = '921b749a90e640a1bdd1ce31c4abda39';
  const REDIRECT_URI = 'https://spotify-top-99.web.app/';

  // const REDIRECT_URI = 'http://localhost:3000/';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';
  const SCOPE = 'user-top-read';
  // ,user-read-private,user-read-email';

  const [token, setToken] = useState('');
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [seedInfo, setSeedInfo] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [userProfile, setUserProfile] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find(elem => elem.startsWith('access_token'))
        .split('=')[1];

      window.location.hash = '';
      window.localStorage.setItem('token', token);
    }

    setToken(token);
  }, []);

  useEffect(() => {
    if (token != '') {
      topTracks();
      topArtists();
      getGenres();
      getUser();
    }
  }, [token]);

  const getUser = async () => {
    const user = await getUserProfile(token);
    console.log('top', user);
    setUserProfile(user);
  };

  const logout = () => {
    setToken('');
    window.localStorage.removeItem('token');
  };

  const topTracks = async () => {
    const top = await userTopItemsRequest(token, 'tracks', 'short_term');
    console.log('top', top.items);
    setTracks(top.items);
  };

  const topArtists = async () => {
    const top = await userTopItemsRequest(token, 'artists', 'long_term');
    console.log('top', top.items);
    setArtists(top.items);
  };

  const goToStatsPage = () => {
    history.replace('stats');
  };
  const goToHomePage = () => {
    history.replace('');
  };
  const goToPlaylistPage = () => {
    history.replace('playlist');
  };
  const style = {
    display: 'inline-block',
    height: 300,
    marginLeft: 70,
  };

  const onFinish = values => {
    console.log(playlistLimit);
    setSeedInfo(values);
  };
  useEffect(() => {
    if (token != '') {
      getReco();
    }
  }, [seedInfo]);

  const [playlistLimit, setPlaylistLimit] = useState(20);

  const getReco = async () => {
    const reco = await getRecommendations(token, seedInfo, playlistLimit);
    console.log('reco', reco);
    setRecommendations(reco);
  };

  const getGenres = async () => {
    const genreSeeds = await getGenreSeeds(token);
    console.log('reco', genreSeeds);
    setGenres(genreSeeds);
  };

  const getTrackDescription = m => {
    let description;
    if (m.artists.length === 1) {
      description = m.artists[0].name;
    } else {
      description = m.artists[0].name + ' with ';
      for (let i = 1; i < m.artists.length; i++) {
        description += m.artists[i].name;
        // If this is not the last artist, add a comma and space
        if (i < m.artists.length - 1) {
          description += ', ';
        }
      }
    }
    return description;
  };

  const handleCreatePlaylist = async e => {
    e.preventDefault();
    console.log(userProfile);
    const playlist = await createPlaylist(token, playlistName, userProfile.id);
    console.log('new', newPlaylist);
    success();
    setNewPlaylist(playlist);
  };

  const addToPlaylist = async () => {
    console.log(userProfile);
    const playlist = await addItemsToPlaylist(
      token,
      newPlaylist.id,
      (recommendations.tracks ? recommendations.tracks : []).map(
        track => track.uri,
      ),
    );
  };

  useEffect(() => {
    console.log('new', newPlaylist);

    addToPlaylist();
  }, [newPlaylist]);

  const [playlistName, setPlaylistName] = useState(
    (!!userProfile.display_name &&
      userProfile.display_name + "'s custom playlist...") ||
      'Your custom playlist...',
  );

  const handleTextChange = event => {
    console.log(event);

    setPlaylistName(event);
  };

  // const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    message.success('Playlist successfully created');
  };

  return (
    <div>
      <header className="App-header">
        {/* <div className="App"> */}
        <Helmet>
          <title>MySpotify99 - Playlist</title>
        </Helmet>
        <Layout>
          <SpotifyHeader
            token={token}
            goToHomePage={goToHomePage}
            goToStatsPage={goToStatsPage}
            goToPlaylistPage={goToPlaylistPage}
            logout={logout}
          />
          <Content
            style={{
              padding: '50px 50px',

              ...contentStyle,
            }}
          >
            <Typography.Title>Playlist Genius</Typography.Title>
            <Typography.Paragraph>
              Choose your favourite tracks, artists, and genres and adjust the
              sliders to get a custom-made playlist!
            </Typography.Paragraph>

            <RecommendationForm
              artists={artists}
              tracks={tracks}
              genres={genres}
              onFinish={onFinish}
              //   playlistLimit={playlistLimit}
              setPlaylistLimit={setPlaylistLimit}
            />
            <Card style={{ textAlign: 'center' }} bordered>
              <Typography.Text style={{ fontSize: '20px' }}>
                3. Create your playlist
              </Typography.Text>
              <Typography.Title editable={{ onChange: handleTextChange }}>
                {/* {(!!userProfile.display_name &&
                  userProfile.display_name + "'s custom playlist...") ||
                  'Your custom playlist...'} */}
                {playlistName}
              </Typography.Title>
              {!recommendations.tracks ? (
                <Empty description="Get your custom playlist" />
              ) : (
                <>
                  <List
                    // pagination={paginationProps}
                    bordered={false}
                    size="small"
                    dataSource={recommendations.tracks}
                    grid={{ column: 3 }}
                    renderItem={(m, k) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            !!m.album.images[0] && (
                              <Avatar src={m.album.images[0].url || null} />
                            )
                          }
                          title={
                            <a href={m.external_urls.spotify} target="_blank">
                              {/* <h2> */}
                              {k + 1}. {m.name} by {getTrackDescription(m)}
                              {/* </h2> */}
                            </a>
                          }
                        />
                        {/* {m.duration_ms} */}
                      </List.Item>
                    )}
                  />
                  <Button
                    style={{ backgroundColor: '#191414', color: '#1DB954' }}
                    onClick={handleCreatePlaylist}
                  >
                    Create Playlist
                  </Button>
                </>
              )}
            </Card>
          </Content>
        </Layout>
      </header>
    </div>
  );
}
export default withRouter(PlaylistPage);
