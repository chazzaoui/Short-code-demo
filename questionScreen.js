import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import uuid from 'uuid/v4';
import { FontAwesome } from '@expo/vector-icons';
import * as Sentry from 'sentry-expo';

import { isEmpty } from '../../utils';
import { colors, fonts, spacing } from '../../themes';
import { submitPost } from '../../redux/state/post';
import ThemeButton from '../../components/ThemeButton';
import { getAllThemes } from '../../redux/state/knowledge';
import Loader from '../../components/Loader';
import i18n from '../../services/i18nService';

const { height, width } = Dimensions.get('window');

const QuestionScreen = ({ getThemes, navigation, submit, themes }) => {
  const [tags, setTags] = useState([]);
  const [teaser, setTeaser] = useState(null);
  const [theme, setTheme] = useState([]);
  const [question, setQuestion] = useState(null);
  const tagInput = React.createRef();
  const data = {
    tags,
    teaser,
    theme,
    question,
  };

  const onSubmit = () => {
    try {
      submit(data);
      navigation.dispatch(navigation.popToTop());
      navigation.navigate('Home');
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const onPressTheme = (state, title) => {
    if (state) {
      setTheme([...theme, title]);
    }
    setTheme(theme.filter(item => item !== title));
  };

  const addTags = e => {
    setTags([...tags, e.nativeEvent.text]);
    tagInput.current.clear();
  };

  const onDeleteTag = label => {
    setTags(tags.filter(item => item !== label));
  };

  useEffect(() => {
    getThemes();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>{i18n.t('askQuestion')}</Text>
          <View style={styles.questionInputContainer}>
            <TextInput
              autoCapitalize="sentences"
              keyboardType="default"
              value={question}
              onChangeText={value => setQuestion(value)}
              blurOnSubmit={false}
              multiline
              style={styles.placeHolder}
              placeholder={`${i18n.t('fillQuestion')}...`}
              placeholderTextColor={colors.neutrals[600]}
            />
          </View>
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.title}>{i18n.t('explainQuestion')}</Text>
          <View style={styles.questionInputContainer}>
            <TextInput
              autoCapitalize="sentences"
              keyboardType="default"
              value={teaser}
              onChangeText={value => setTeaser(value)}
              blurOnSubmit={false}
              multiline
              style={styles.placeHolder}
              placeholder={`${i18n.t('fillExplainQuestion')}...`}
              placeholderTextColor={colors.neutrals[600]}
            />
          </View>
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.title}>
          {i18n.t('whatTheme')}
          </Text>
          {!isEmpty(themes) ? (
            themes.map(item => (
              <ThemeButton
                handleActive={(state, title) => onPressTheme(state, title)}
                key={item.id}
                title={item.title}
                image={item.image}
              />
            ))
          ) : (
            <Loader />
          )}
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.title}>{i18n.t('addTags')}</Text>
        </View>

        <View style={styles.labelInputHolder}>
          <TextInput
            autoCapitalize="sentences"
            keyboardType="default"
            ref={tagInput}
            onSubmitEditing={e => addTags(e)}
            style={styles.labelInput}
            placeholder={`${i18n.t('keyword')}...`}
            placeholderTextColor={colors.neutrals[600]}
          />
        </View>

        <View style={styles.tagsView}>
          {!isEmpty(tags) &&
            tags.map(item => {
              return (
                <TouchableOpacity onPress={() => onDeleteTag(item)} key={uuid()}>
                  <View style={styles.tagsHolder}>
                    <Text style={styles.tagsText}>{item}</Text>
                    <FontAwesome
                      color={colors.neutrals[100]}
                      fontSize={35}
                      name="remove"
                      style={styles.deleteIcon}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
        </View>
        <TouchableOpacity style={styles.buttonPost} onPress={onSubmit}>
          <Text style={styles.buttonText}>{i18n.t('placing')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonDisabled: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: colors.neutrals[600],
    borderWidth: 1,
    borderRadius: 50,
    height: 51,
    justifyContent: 'center',
    marginVertical: spacing.sm,
    width: width * 0.6,
  },
  buttonPost: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primary[500],
    borderRadius: 50,
    elevation: 2,
    height: 51,
    justifyContent: 'center',
    marginVertical: spacing.sm,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    width: 267,
  },
  buttonText: {
    color: colors.neutrals[100],
    fontFamily: fonts.types.bold,
    fontSize: 18,
  },
  buttonTextDisabled: {
    color: colors.neutrals[600],
    fontFamily: fonts.types.bold,
    fontSize: 18,
  },
  container: {
    backgroundColor: colors.neutrals[200],
    flex: 1,
  },
  deleteIcon: {
    paddingRight: spacing.sm,
  },
  labelInput: {
    color: colors.neutrals[600],
    fontFamily: fonts.types.regular,
    fontSize: 16,
    width: width * 0.4,
  },
  labelInputHolder: {
    alignItems: 'center',
    backgroundColor: colors.neutrals[100],
    borderColor: colors.primary[500],
    borderWidth: 1,
    borderRadius: 5,
    height: height * 0.05,
    justifyContent: 'center',
    marginLeft: spacing.md,
    width: width * 0.5,
  },
  placeHolder: {
    color: colors.neutrals[600],
    fontFamily: fonts.types.regular,
    fontSize: 18,
    paddingLeft: spacing.md,
    paddingTop: spacing.xs,
    width: width * 0.7,
  },
  question: {
    width: width * 0.6,
  },
  questionContainer: {
    marginBottom: spacing.lg,
    marginVertical: spacing.md,
  },
  questionIcon: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.lg,
  },
  questionInputContainer: {
    alignItems: 'flex-start',
    backgroundColor: colors.neutrals[100],
    borderColor: colors.primary[500],
    borderWidth: 2,
    flexDirection: 'row',
    height: width * 0.3,
    marginHorizontal: spacing.md,
  },
  questionTitle: {
    fontFamily: fonts.types.bold,
    fontSize: 19,
    marginBottom: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  tagsHolder: {
    alignItems: 'center',
    backgroundColor: colors.tertiary[500],
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  tagsText: {
    color: colors.neutrals['100'],
    fontFamily: fonts.types.bold,
    fontSize: 15,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  tagsView: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: spacing.md,
    marginVertical: spacing.xl,
  },
  title: {
    fontFamily: fonts.types.bold,
    fontSize: 19,
    marginBottom: spacing.md,
    marginHorizontal: spacing.md,
  },
});

QuestionScreen.propTypes = {
  submit: PropTypes.instanceOf(Object),
  getThemes: PropTypes.func.isRequired,
  themes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      image: PropTypes.string,
    })
  ),
};

QuestionScreen.defaultProps = {
  submit: null,
  themes: null,
};

const mapStateToProps = state => {
  return {
    themes: state.knowledge.allThemes,
  };
};

const mapDispatchToProps = dispatch => ({
  getThemes: () => dispatch(getAllThemes()),
  submit: data => dispatch(submitPost(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestionScreen);
