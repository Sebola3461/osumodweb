import { AxiosError } from "axios"

export type modwebUser = {
    status: number,
    _id: string,
    username: string,
    hasQueue: boolean,
    account_token: string,
    access_token: string
    refresh_token: string
    osuData: object
}

export type createQueueRequest = {
  user_id: string,
  maxpending: number,
  cooldown: number,
  color: number,
  modes: Array<number>,
  rules: string,
  name: string,
  m4m: boolean,
  isBn: boolean
}

type code_grant = {
    access_token: String,
    expires_in: Number,
    refresh_token: String,
    token_type: string
}

export type databaseError = {
    code: number,
    message: string
}

export type osuUserApiResponse = {
    "avatar_url": string,
    "country_code": string,
    "default_group": string,
    "id": number,
    "is_active": boolean,
    "is_bot": boolean,
    "is_deleted": boolean,
    "is_online": boolean,
    "is_supporter": boolean,
    "last_visit": string,
    "pm_friends_only": boolean,
    "profile_colour": string,
    "username": string,
    "cover_url": string,
    "discord": string,
    "has_supported": boolean,
    "interests": boolean,
    "join_date": string,
    "kudosu": {
      "total": number,
      "available": number
    },
    "location": null,
    "max_blocks": number,
    "max_friends": number,
    "occupation": null,
    "playmode": "osu",
    "playstyle": [
      "mouse",
      "touch"
    ],
    "post_count": number,
    "title": string | null,
    "twitter": string,
    "website": string,
    "country": {
      "code": string,
      "name": string
    },
    "cover": {
      "custom_url": string,
      "url": string,
      "id": null | number
    },
    "is_restricted": boolean,
    "account_history": Array<string>,
    "favourite_beatmapset_count": number,
    "follower_count": number,
    "graveyard_beatmapset_count": number,
    "groups": Array<{
        "id": number,
        "identifier": string,
        "name": string,
        "short_name": string,
        "description": string,
        "colour": string
      }>,
    "loved_beatmapset_count": number,
    "pending_beatmapset_count": number,
    "previous_usernames": Array<string>,
    "ranked_beatmapset_count": number,
    "scores_first_count": number,
    "statistics": {
      "level": {
        "current": number,
        "progress": number
      },
      "pp": number,
      "global_rank": number,
      "ranked_score": number,
      "hit_accuracy": number,
      "play_count": number,
      "play_time": number,
      "total_score": number,
      "total_hits": number,
      "maximum_combo": number,
      "replays_watched_by_others": number,
      "is_ranked": boolean,
      "grade_counts": {
        "ss": number,
        "ssh": number,
        "s": number,
        "sh": number,
        "a": number
      },
      "rank": {
        "global": number,
        "country": number
      }
    },
    "support_level": number,
    "user_achievements": [
      {
        "achieved_at": string,
        "achievement_id": number
      }
    ],
    "rank_history": {
      "mode": "osu",
      "data": [
        number,
        number,
        number
      ]
    }
  }

export type osuUserToken = {
  access_token: string,
  expires_in?: number,
  refresh_token: string,
  token_type?: string,
};

export type searchQueueRequest = {
  mode: string,
  isBn: string,
  username: string,
  genres: string,
  languages: string,
  open: string,
}


export type osuApiBeatmaps = [
  {
    "artist": string,
    "artist_unicode": string,
    "covers": {
      "cover": string,
      "cover@2x": string,
      "card": string,
      "card@2x": string,
      "list": string,
      "list@2x": string,
      "slimcover": string,
      "slimcover@2x": string
    },
    "creator": string,
    "favourite_count": number,
    "hype": {
      "current": number,
      "required": number
    },
    "id": number,
    "nsfw": boolean,
    "play_count": number,
    "preview_url": string,
    "source": string | null,
    "status": string,
    "title": string,
    "title_unicode": string,
    "track_id": number | null,
    "user_id": number,
    "video": boolean,
    "availability": {
      "download_disabled": boolean,
      "more_information": string | null
    },
    "bpm": number,
    "can_be_hyped": boolean,
    "discussion_enabled": boolean,
    "discussion_locked": boolean,
    "is_scoreable": boolean,
    "last_updated": string,
    "legacy_thread_url": string,
    "nominations_summary": {
      "current": number,
      "required": number
    },
    "ranked": number,
    "ranked_date": null|string,
    "storyboard": boolean,
    "submitted_date": string,
    "beatmaps": [{
        "beatmapset_id": number,
        "difficulty_rating": number,
        "id": number,
        "mode": string,
        "status": string,
        "total_length": number,
        "user_id": number,
        "version": string,
        "accuracy": number,
        "ar": number,
        "bpm": number,
        "convert": boolean,
        "count_circles": number,
        "count_sliders": number,
        "count_spinners": number,
        "cs": number,
        "deleted_at": null,
        "drain": number,
        "hit_length": number,
        "is_scoreable": boolean,
        "last_updated": string,
        "mode_int": number,
        "passcount": number,
        "playcount": number,
        "ranked": number,
        "url": string,
        "checksum": string
      }
    ]
  }]